import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type ContactEmailProps = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  source: string;
};

export function ContactEmail({
  name,
  email,
  phone,
  message,
  source,
}: ContactEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>🏠 New Lead from {name} - Kuber Property</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <div style={header}>
            <Heading style={logo}>KUBER PROPERTY</Heading>
            <Text style={tagline}>Luxury Real Estate in Vadodara</Text>
          </div>

          {/* Main Content */}
          <div style={card}>
            <Heading style={h2}>🎯 New Lead Received</Heading>
            <Text style={intro}>
              You have a new inquiry from <strong>{name}</strong>. Here are the details:
            </Text>

            <Section style={infoSection}>
              <div style={infoRow}>
                <Text style={label}>👤 Name:</Text>
                <Text style={value}>{name}</Text>
              </div>
              <div style={infoRow}>
                <Text style={label}>📧 Email:</Text>
                <Link href={`mailto:${email}`} style={link}>{email}</Link>
              </div>
              {phone && (
                <div style={infoRow}>
                  <Text style={label}>📱 Phone:</Text>
                  <Link href={`tel:${phone}`} style={link}>{phone}</Link>
                </div>
              )}
              <div style={infoRow}>
                <Text style={label}>📍 Source:</Text>
                <Text style={value}>{source}</Text>
              </div>
            </Section>

            <Section style={messageSection}>
              <Text style={label}>💬 Message:</Text>
              <div style={messageBox}>{message}</div>
            </Section>

            <Section style={actionSection}>
              <Button style={button} href={`mailto:${email}`}>
                📧 Reply to {name}
              </Button>
              {phone && (
                <Button style={button} href={`tel:${phone}`}>
                  📱 Call {name}
                </Button>
              )}
            </Section>
          </div>

          {/* Footer */}
          <Text style={footer}>
            This lead has been automatically saved to your database. Visit your admin panel for more details.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f5f5f5",
  fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
  margin: "0",
  padding: "20px",
};

const container = {
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

const header = {
  backgroundColor: "#0a1628",
  padding: "30px",
  textAlign: "center" as const,
};

const logo = {
  color: "#c9a227",
  fontSize: "28px",
  fontWeight: "bold",
  margin: "0",
  letterSpacing: "2px",
};

const tagline = {
  color: "#ffffff",
  fontSize: "14px",
  margin: "8px 0 0 0",
  opacity: 0.9,
};

const card = {
  padding: "30px",
};

const h2 = {
  color: "#0a1628",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0 0 16px 0",
};

const intro = {
  color: "#333333",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 24px 0",
};

const infoSection = {
  backgroundColor: "#f8f9fa",
  borderRadius: "8px",
  padding: "20px",
  marginBottom: "24px",
};

const infoRow = {
  display: "flex",
  marginBottom: "12px",
  alignItems: "center",
};

const label = {
  color: "#666666",
  fontSize: "14px",
  fontWeight: "600",
  width: "100px",
  margin: "0",
};

const value = {
  color: "#333333",
  fontSize: "15px",
  margin: "0",
};

const link = {
  color: "#c9a227",
  textDecoration: "none",
  fontSize: "15px",
};

const messageSection = {
  marginBottom: "24px",
};

const messageBox = {
  backgroundColor: "#fff9e6",
  borderLeft: "4px solid #c9a227",
  padding: "16px",
  borderRadius: "4px",
  color: "#333333",
  fontSize: "15px",
  lineHeight: "1.6",
};

const actionSection = {
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#c9a227",
  color: "#ffffff",
  padding: "12px 24px",
  borderRadius: "6px",
  textDecoration: "none",
  fontWeight: "bold",
  fontSize: "14px",
  display: "inline-block",
  margin: "8px 4px",
  border: "none",
};

const footer = {
  color: "#999999",
  fontSize: "12px",
  textAlign: "center" as const,
  padding: "20px 30px",
  margin: "0",
  borderTop: "1px solid #eeeeee",
};

export default ContactEmail;
