import { Resend } from "resend";
import { SUPPORT_EMAIL } from "@/lib/constants";

let _resend: Resend | null = null;

export function getResend() {
  if (!_resend && process.env.RESEND_API_KEY) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

/** Display / reply-to address (always support@kuberproperty.in) */
export const REPLY_TO_EMAIL = process.env.REPLY_TO_EMAIL || SUPPORT_EMAIL;

/** @deprecated Use sendLeadEmails from @/lib/email */
export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || `Kuber Property <${SUPPORT_EMAIL}>`;

/** @deprecated Use LEAD_NOTIFICATION_EMAIL from constants */
export const ADMIN_EMAIL =
  process.env.LEAD_NOTIFICATION_EMAIL ||
  process.env.ADMIN_EMAIL ||
  "nimesh8524@gmail.com";
