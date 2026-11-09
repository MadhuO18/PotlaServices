import { createClient } from "npm:@supabase/supabase-js@2";

const maxNameLength = 120;
const maxEmailLength = 254;
const maxSubjectLength = 160;
const maxMessageLength = 1000;

function jsonResponse(body: Record<string, string>, status: number, origin: string) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Headers": "authorization, apikey, content-type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Content-Type": "application/json",
      "Vary": "Origin",
    },
  });
}

Deno.serve(async (request) => {
  const origin = request.headers.get("origin");
  const allowedOrigins = (
    Deno.env.get("CONTACT_ALLOWED_ORIGINS") ??
    Deno.env.get("CAREERS_ALLOWED_ORIGINS") ??
    ""
  )
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (!origin || !allowedOrigins.includes(origin)) {
    return new Response("Origin not allowed", { status: 403 });
  }
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Headers": "authorization, apikey, content-type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Vary": "Origin",
      },
    });
  }
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed." }, 405, origin);
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 6000) {
    return jsonResponse({ error: "The submitted message is too large." }, 413, origin);
  }

  try {
    if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
      return jsonResponse({ error: "Submit your message using the provided form." }, 400, origin);
    }

    const payload = await request.json();
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return jsonResponse({ error: "Check the message details and try again." }, 400, origin);
    }
    if (typeof payload.website === "string" && payload.website.trim()) {
      return jsonResponse({ error: "Unable to submit this message." }, 400, origin);
    }

    const name = typeof payload.name === "string" ? payload.name.trim() : "";
    const email = typeof payload.email === "string" ? payload.email.trim() : "";
    const subject = typeof payload.subject === "string" ? payload.subject.trim() : "";
    const message = typeof payload.message === "string" ? payload.message.trim() : "";

    if (
  !name ||
  name.length > maxNameLength ||
  !email ||
  email.length > maxEmailLength ||
  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
  subject.length > maxSubjectLength ||
  !message ||
  message.length > maxMessageLength
) {
  return jsonResponse(
    { error: "Check the message details and try again." },
    400,
    origin
  );
}

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const whatsappAccessToken = Deno.env.get("WHATSAPP_ACCESS_TOKEN");
    const whatsappPhoneNumberId = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID");
    const whatsappRecipient = Deno.env.get("WHATSAPP_RECIPIENT_PHONE");
    const whatsappTemplateName = Deno.env.get("WHATSAPP_TEMPLATE_NAME");
    const whatsappTemplateLanguage = Deno.env.get("WHATSAPP_TEMPLATE_LANGUAGE");
    const graphApiVersion = Deno.env.get("WHATSAPP_GRAPH_API_VERSION");

    
    if (!supabaseUrl || !serviceRoleKey) {
  console.error("Supabase configuration is missing.");
  return jsonResponse(
    { error: "The contact service is temporarily unavailable." },
    503,
    origin
  );
}

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data: inquiry, error: insertError } = await supabase
      .from("contact_inquiries")
      .insert({ name, email, subject: subject || null, message })
      .select("id")
      .single();

    if (insertError) {
      console.error("Contact inquiry database insert failed.");
      return jsonResponse({ error: "We could not save your message. Please try again later." }, 500, origin);
    }

    return jsonResponse(
  { inquiryId: inquiry.id },
  201,
  origin
);
    let graphResponse: Response;
    try {
      graphResponse = await fetch(
        `https://graph.facebook.com/${graphApiVersion}/${whatsappPhoneNumberId}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${whatsappAccessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: whatsappRecipient,
            type: "template",
            template: {
              name: whatsappTemplateName,
              language: { code: whatsappTemplateLanguage },
              components: [{
                type: "body",
                parameters: [
                  { type: "text", text: name },
                  { type: "text", text: email },
                  { type: "text", text: subject || "Not provided" },
                  { type: "text", text: message },
                ],
              }],
            },
          }),
        },
      );
    } catch (error) {
      console.error("Contact inquiry WhatsApp request failed.", error);
      const { error: updateError } = await supabase
        .from("contact_inquiries")
        .update({ notification_status: "failed" })
        .eq("id", inquiry.id);
      if (updateError) console.error("Contact inquiry delivery status update failed.");
      return jsonResponse({
        error: "Your message was saved, but we could not alert the team. Please contact us by phone or email.",
      }, 502, origin);
    }

    if (!graphResponse.ok) {
      console.error("Contact inquiry WhatsApp delivery failed.", graphResponse.status);
      const { error: updateError } = await supabase
        .from("contact_inquiries")
        .update({ notification_status: "failed" })
        .eq("id", inquiry.id);
      if (updateError) console.error("Contact inquiry delivery status update failed.");
      return jsonResponse({
        error: "Your message was saved, but we could not alert the team. Please contact us by phone or email.",
      }, 502, origin);
    }

    const { error: updateError } = await supabase
      .from("contact_inquiries")
      .update({ notification_status: "sent" })
      .eq("id", inquiry.id);
    if (updateError) {
      console.error("Contact inquiry delivery status update failed.");
    }

    return jsonResponse({ inquiryId: inquiry.id }, 201, origin);
  } catch (error) {
    console.error("Contact inquiry submission failed.", error);
    return jsonResponse({ error: "We could not submit your message. Please try again later." }, 500, origin);
  }
});
