import { render } from "@react-email/render";
import { ContactEmail } from "@/emails/contact-email";
import { AutoReplyEmail } from "@/emails/auto-reply";
import { getResend } from "@/lib/resend";
import { SUPPORT_EMAIL, LEAD_NOTIFICATION_EMAIL } from "@/lib/constants";

export type LeadEmailPayload = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  source: string;
  propertyTitle?: string;
};

/** Verified domain sender; falls back to Resend sandbox if send fails. */
function getFromAddress() {
  // Directly use the verified domain email
  return "support@kuberproperty.in";
}

function getFallbackFrom() {
  return (
    process.env.RESEND_FALLBACK_FROM ||
    "Kuber Property <onboarding@resend.dev>"
  );
}

async function sendWithFallback(options: {
  from: string;
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}) {
  const resend = getResend();
  if (!resend) {
    console.error("[email] RESEND_API_KEY is not set");
    return { ok: false as const, error: "Email service not configured" };
  }

  const base = {
    to: options.to,
    subject: options.subject,
    html: options.html,
    replyTo: options.replyTo,
  };

  const primaryFrom = options.from || getFromAddress();
  let result = await resend.emails.send({ ...base, from: primaryFrom });

  if (result.error && process.env.RESEND_FALLBACK_FROM !== "false") {
    console.warn("[email] Primary sender failed, using Resend sandbox:", result.error.message);
    result = await resend.emails.send({
      ...base,
      from: getFallbackFrom(),
      replyTo: options.replyTo || SUPPORT_EMAIL,
    });
  }

  if (result.error) {
    console.error("[email] Send failed:", result.error);
    return { ok: false as const, error: result.error.message };
  }

  return { ok: true as const, id: result.data?.id };
}

/**
 * Generic email sender for custom HTML content.
 */
export async function sendEmail(options: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}) {
  return sendWithFallback({
    from: getFromAddress(),
    to: options.to,
    subject: options.subject,
    html: options.html,
    replyTo: options.replyTo,
  });
}

/**
 * Sends lead notification to admin + confirmation to the user.
 */
export async function sendLeadEmails(payload: LeadEmailPayload, subjectPrefix: string) {
  const adminHtml = await render(
    ContactEmail({
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      message: payload.propertyTitle
        ? `${payload.message}\n\nProperty: ${payload.propertyTitle}`
        : payload.message,
      source: payload.source,
    })
  );

  const userHtml = await render(AutoReplyEmail({ name: payload.name }));

  // Send admin email first
  const adminResult = await sendWithFallback({
    from: getFromAddress(),
    to: LEAD_NOTIFICATION_EMAIL,
    replyTo: payload.email,
    subject: `${subjectPrefix}: ${payload.name}`,
    html: adminHtml,
  });

  // Wait 500ms to avoid rate limiting
  await new Promise(resolve => setTimeout(resolve, 500));

  // Send user confirmation email
  const userResult = await sendWithFallback({
    from: getFromAddress(),
    to: payload.email,
    replyTo: SUPPORT_EMAIL,
    subject: "Thank you for contacting Kuber Property",
    html: userHtml,
  });

  return {
    admin: adminResult,
    user: userResult,
    success: adminResult.ok && userResult.ok,
  };
}
