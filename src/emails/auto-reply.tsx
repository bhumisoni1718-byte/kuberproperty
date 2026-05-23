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

const SUPPORT = "support@kuberproperty.in";
const PHONE = "+91 991603144";
const WEBSITE = "http://localhost:3000";

export function AutoReplyEmail({ name }: { name: string }) {
  return (
    <Html>
      <Head />
      <Preview>We've Received Your Inquiry - Kuber Property</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Hero Section */}
          <Section style={heroSection}>
            <Text style={heroTagline}>VADODARA'S PREMIER REALTY</Text>
            <Heading style={heroHeading}>We've Received<br/>Your Inquiry ✨</Heading>
            <Text style={heroText}>
              Thank you for connecting with Kuber Property. Your dream home journey starts here.
            </Text>
          </Section>

          {/* Body */}
          <Section style={bodySection}>
            <Text style={greeting}>Dear <strong>{name}</strong>,</Text>
            <Text style={bodyText}>
              We're delighted to know that you're exploring premium living spaces with us.
              Our consultants are currently reviewing your inquiry and will connect with you shortly.
            </Text>

            {/* Features */}
            <Section style={featuresSection}>
              <Heading style={featuresHeading}>What Happens Next?</Heading>
              <Text style={featureText}>🏡 Personalized property recommendations</Text>
              <Text style={featureText}>📞 Consultation with our luxury real estate expert</Text>
              <Text style={featureText}>✨ Exclusive premium property options in Vadodara</Text>
            </Section>

            {/* CTA Button */}
            <Section style={ctaSection}>
              <Button style={button} href={WEBSITE}>
                Explore Properties
              </Button>
            </Section>

            <Text style={messageText}>
              Until then, imagine beautiful mornings, peaceful gardens, elegant interiors,
              and a home where memories are waiting to be made. 🌿
            </Text>

            {/* Footer */}
            <Section style={footerSection}>
              <Section style={footerContent}>
                <div style={footerLeft}>
                  <Heading style={footerHeading}>Kuber Property</Heading>
                  <Text style={footerSubtext}>Luxury Realty • Vadodara</Text>
                </div>
                <div style={footerRight}>
                  <Text style={footerContact}>📞 {PHONE}</Text>
                  <Text style={footerContact}>🌐 www.kuberproperty.in</Text>
                </div>
              </Section>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f3f4f6",
  fontFamily: "Arial, sans-serif",
  margin: "0",
  padding: "0",
};

const container = {
  maxWidth: "650px",
  margin: "40px auto",
  backgroundColor: "#ffffff",
  borderRadius: "18px",
  overflow: "hidden",
};

const heroSection = {
  background: "linear-gradient(rgba(15,23,42,0.75), rgba(15,23,42,0.75)), url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop') center/cover no-repeat",
  padding: "70px 50px",
};

const heroTagline = {
  color: "#d4a81e",
  fontSize: "13px",
  letterSpacing: "3px",
  margin: "0",
};

const heroHeading = {
  color: "#ffffff",
  fontSize: "48px",
  lineHeight: "1.2",
  margin: "20px 0",
  fontWeight: "bold",
};

const heroText = {
  color: "#f3f4f6",
  fontSize: "18px",
  lineHeight: "1.8",
  maxWidth: "480px",
  margin: "0",
};

const bodySection = {
  padding: "50px",
};

const greeting = {
  color: "#374151",
  fontSize: "17px",
  lineHeight: "1.8",
  marginTop: "0",
};

const bodyText = {
  color: "#6b7280",
  fontSize: "16px",
  lineHeight: "1.9",
};

const featuresSection = {
  backgroundColor: "#f9fafb",
  borderRadius: "14px",
  margin: "35px 0",
  padding: "25px",
};

const featuresHeading = {
  marginTop: "0",
  color: "#111827",
  fontSize: "22px",
};

const featureText = {
  color: "#4b5563",
  fontSize: "15px",
  lineHeight: "1.8",
  margin: "10px 0",
};

const ctaSection = {
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#d4a81e",
  color: "#111827",
  padding: "16px 34px",
  fontSize: "16px",
  textDecoration: "none",
  fontWeight: "bold",
  borderRadius: "10px",
  display: "inline-block",
};

const messageText = {
  color: "#6b7280",
  fontSize: "16px",
  lineHeight: "1.9",
  marginTop: "40px",
};

const footerSection = {
  borderTop: "1px solid #e5e7eb",
  marginTop: "40px",
  paddingTop: "40px",
};

const footerContent = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
};

const footerLeft = {
  textAlign: "left" as const,
};

const footerHeading = {
  margin: "0",
  color: "#111827",
  fontSize: "18px",
};

const footerSubtext = {
  margin: "8px 0",
  color: "#6b7280",
  fontSize: "14px",
};

const footerRight = {
  textAlign: "right" as const,
};

const footerContact = {
  margin: "8px 0",
  color: "#6b7280",
  fontSize: "14px",
};

export default AutoReplyEmail;
