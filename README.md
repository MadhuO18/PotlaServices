# Potla Services — React Replica

A frontend-only React recreation of https://potlaservices.com/, built with Vite + React Router.
The original template CSS, images, and icon fonts are reused; all jQuery/Bootstrap-JS behavior
(carousels, sticky navbar, dropdowns, side modal, accordions, counters, portfolio filter,
lightbox, video popup, forms) has been reimplemented as React components.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
```

## Build

```bash
npm run build    # outputs static site to dist/
npm run preview  # serve the production build
```

## Routes

`/`, `/about`, `/careers`, `/contact`, `/dermishine`, `/faq`, `/portfolio`,
`/potla-consulting`, `/potla-logistics`, `/potla-overseas`, `/potla-tech-solutions`,
`/privacy-policy`, `/teluguwebmedia`, `/terms-conditions`, `/testimonials`,
`/digitalmarketing`, `/mobileapplicationdevelopment`, `/webdesignandwebdevelopment`

## Career application storage

The careers form sends applicant details to a Supabase Edge Function. The function stores
application records in a table and resumes in a private Storage bucket; the Supabase
service-role key is used only by the function and must never be added to frontend variables.

1. Create a Supabase project and install the Supabase CLI.
2. Open PowerShell and change to this repository folder before running Supabase commands.
   The migration and Edge Function paths are relative to the repository root, not your
   home directory:

   ```powershell
   Set-Location 'C:\Users\madhu\Downloads\potla-react-replica\potla-replica'
   npx supabase login
   npx supabase link --project-ref ojuldtcjtwjbpapnzzlo
   npx supabase db push
   ```

3. Set the exact browser origin(s) allowed to submit applications, then deploy the function:

   ```powershell
   npx supabase secrets set "CAREERS_ALLOWED_ORIGINS=http://127.0.0.1:5173,http://localhost:5173,https://your-domain.example"
   npx supabase functions deploy submit-career-application
   ```

   Replace `https://your-domain.example` with the deployed site's exact origin. The local
   origins above are included for development. `SUPABASE_URL` and
   `SUPABASE_SERVICE_ROLE_KEY` are provided to the function by Supabase.
   The function is public because applicants are not signed in; it validates submissions,
   restricts CORS to the configured origins, and uses the service key only on the server.

4. Create a local `.env` file using `.env.example`, filling in the project URL and the
   project's public anon/publishable key. These `VITE_` variables are public; never put the
   service-role key in `.env` or any `VITE_` variable.
5. Rebuild and deploy the frontend. Applications and their private resumes can then be
   reviewed from the Supabase dashboard. Keep dashboard access limited to authorized staff.

The database migration enables row-level security and grants no direct applicant-table
access to browser roles. Resumes are stored in a non-public bucket and are not exposed by
public URLs.

If the frontend Supabase URL or public key is missing, the careers form temporarily saves
applications to IndexedDB in the applicant's current browser. This local fallback does not
send applications to Potla Group or make them available on other devices; it is not a
replacement for configuring Supabase.

## Contact inquiry storage and WhatsApp notifications

The contact form submits to a Supabase Edge Function. It stores each inquiry in the
`contact_inquiries` table and sends a WhatsApp Business template notification to the
configured recipient. The WhatsApp access token is used only by the Edge Function and
must never be added to frontend variables.

1. In WhatsApp Manager, create and get approval for a template with four body parameters:
   name (`{{1}}`), email (`{{2}}`), subject (`{{3}}`), and message (`{{4}}`). Configure
   the sending phone number in Meta's WhatsApp Business Platform.
2. Push the database migration. The contact function reuses
   `CAREERS_ALLOWED_ORIGINS` when `CONTACT_ALLOWED_ORIGINS` is unset; configure the latter
   only if the contact form should allow a different set of browser origins. Set the
   WhatsApp credentials as Supabase function secrets:

   ```powershell
   npx supabase db push
   npx supabase secrets set "CONTACT_ALLOWED_ORIGINS=http://127.0.0.1:5173,http://localhost:5173,https://your-domain.example"
   npx supabase secrets set "WHATSAPP_ACCESS_TOKEN=your-meta-access-token"
   npx supabase secrets set "WHATSAPP_PHONE_NUMBER_ID=your-sender-phone-number-id"
   npx supabase secrets set "WHATSAPP_RECIPIENT_PHONE=917036297115"
   npx supabase secrets set "WHATSAPP_TEMPLATE_NAME=contact_inquiry"
   npx supabase secrets set "WHATSAPP_TEMPLATE_LANGUAGE=en_US"
   npx supabase secrets set "WHATSAPP_GRAPH_API_VERSION=v23.0"
   npx supabase functions deploy submit-contact-inquiry
   ```

   Replace the example site domain, template name, language, and Graph API version with
   the values configured for your deployment. `SUPABASE_URL` and
   `SUPABASE_SERVICE_ROLE_KEY` are provided to the function by Supabase. The recipient
   number is in international format without a `+` sign. Do not commit access tokens.
3. Configure the frontend `.env` with the Supabase project URL and public anon/publishable
   key, rebuild, and deploy the site.

Inquiries are stored even if WhatsApp notification fails; the form reports that case rather
than displaying a false success. Check `notification_status` in `contact_inquiries` when
troubleshooting delivery. The template must be approved and match the four parameter
positions before notifications can be sent. Contact messages are limited to 1,000
characters to fit WhatsApp template parameters.

## Notes

- Enquiry and newsletter forms remain frontend-only; they do not send or store submissions.
- The Facebook page embed and Google Map on the contact page load from third parties.
- Original scraped markup lives in `src/content/*.html` and is rendered through
  `src/renderContent.jsx`, which swaps interactive blocks for React components.
