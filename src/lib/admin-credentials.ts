/**
 * Admin Credentials Configuration
 * 
 * Edit this file to change admin credentials.
 * After changing credentials, run: npx prisma db seed
 * to update the database with new passwords.
 */

export const ADMIN_CREDENTIALS = {
  email: "admin@kuberproperty.in",
  password: "Manu@2306",
  name: "Admin User",
  role: "ADMIN" as const,
};

export const EDITOR_CREDENTIALS = {
  email: "editor@kuberproperty.in",
  password: "Admin@2311",
  name: "Content Editor",
  role: "EDITOR" as const,
};

export const AGENT_CREDENTIALS = {
  email: "agent@kuberproperty.in",
  password: "agent@2026",
  name: "Raj Patel",
  role: "AGENT" as const,
  phone: "+91 98765 43210",
  bio: "Senior property consultant specializing in luxury Vadodara listings.",
};
