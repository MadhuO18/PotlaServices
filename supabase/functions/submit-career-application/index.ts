import { createClient } from "npm:@supabase/supabase-js@2";

const bucket = "career-resumes";
const maxResumeBytes = 5 * 1024 * 1024;
const allowedRoles = new Set([
  "Python Full Stack Developer",
  "AWS Cloud Engineer",
  "AI/ML Engineer",
  "Java Developer",
  "Mobile Application Developer",
  "Digital Marketer",
]);
const mimeTypes: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

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
  const allowedOrigins = (Deno.env.get("CAREERS_ALLOWED_ORIGINS") ?? "")
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
  if (contentLength > maxResumeBytes + 1024 * 1024) {
    return jsonResponse({ error: "The uploaded request is too large." }, 413, origin);
  }

  try {
    if (!request.headers.get("content-type")?.toLowerCase().startsWith("multipart/form-data")) {
      return jsonResponse({ error: "Submit the application using the provided form." }, 400, origin);
    }

    const form = await request.formData();
    if (String(form.get("website") ?? "").trim()) {
      return jsonResponse({ error: "Unable to submit this application." }, 400, origin);
    }

    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    const role = String(form.get("role") ?? "").trim();
    const resume = form.get("resume");

    if (!name || name.length > 120 || !email || email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      !phone || phone.length > 40 || !allowedRoles.has(role)) {
      return jsonResponse({ error: "Check the application details and try again." }, 400, origin);
    }
    if (!(resume instanceof File) || resume.size === 0 || resume.size > maxResumeBytes) {
      return jsonResponse({ error: "Attach a resume no larger than 5 MB." }, 400, origin);
    }

    const extension = resume.name.split(".").pop()?.toLowerCase() ?? "";
    const contentType = mimeTypes[extension];
    if (!contentType || (resume.type && resume.type !== contentType)) {
      return jsonResponse({ error: "Resumes must be PDF, DOC, or DOCX files." }, 400, origin);
    }
    const signature = new Uint8Array(await resume.slice(0, 8).arrayBuffer());
    const isPdf = extension === "pdf" &&
      new TextDecoder().decode(signature.slice(0, 5)) === "%PDF-";
    const isDoc = extension === "doc" &&
      signature.join(",") === "208,207,17,224,161,177,26,225";
    const isDocx = extension === "docx" &&
      signature[0] === 80 && signature[1] === 75 &&
      signature[2] === 3 && signature[3] === 4;
    if (!isPdf && !isDoc && !isDocx) {
      return jsonResponse({ error: "The resume contents do not match a supported document type." }, 400, origin);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Career application storage is not configured.");
      return jsonResponse({ error: "The application service is temporarily unavailable." }, 503, origin);
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const resumePath = `${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(resumePath, resume, { contentType, upsert: false });
    if (uploadError) {
      console.error("Career resume upload failed.");
      return jsonResponse({ error: "We could not store your resume. Please try again later." }, 500, origin);
    }

    const { data, error: insertError } = await supabase
      .from("career_applications")
      .insert({ name, email, phone, role, resume_path: resumePath })
      .select("id")
      .single();

    if (insertError) {
      const { error: cleanupError } = await supabase.storage.from(bucket).remove([resumePath]);
      if (cleanupError) console.error("Career resume cleanup failed after database error.");
      console.error("Career application database insert failed.");
      return jsonResponse({ error: "We could not save your application. Please try again later." }, 500, origin);
    }

    return jsonResponse({ applicationId: data.id }, 201, origin);
  } catch {
    console.error("Career application submission failed.");
    return jsonResponse({ error: "We could not submit your application. Please try again later." }, 500, origin);
  }
});
