import { NextResponse } from "next/server";
import { sendLeadEmails } from "@/lib/email";

/** Dev-only: GET /api/email/test to verify Resend (remove in production or protect) */
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  const result = await sendLeadEmails(
    {
      name: "Test User",
      email: "nimesh8524@gmail.com",
      phone: "+91 9999999999",
      message: "This is a test lead from Kuber Property email setup.",
      source: "email-test",
    },
    "Test Lead"
  );

  return NextResponse.json(result);
}
