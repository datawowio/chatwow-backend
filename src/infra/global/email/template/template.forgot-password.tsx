import * as React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { User } from '@domain/base/user/user.domain';
import { Logo } from '../asset/logo';
import { mockUser } from '@domain/base/user/user.factory';

type DefaultProps = {
  user: User;
  url: string;
};

export default function TemplateForgotPassword({ user, url }: DefaultProps) {
  user ??= mockUser({});
  url ??= 'http://localhost:8001';

  const firstName = user.firstName || 'there';

  return (
    <Html>
      <Head />
      <Preview>Reset your password for ChatWow</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoSection}>
            <Logo width={120} height={40} />
          </Section>

          <Heading style={h1}>Reset your password</Heading>

          <Text style={text}>Hi {firstName},</Text>

          <Text style={text}>
            Someone recently requested a password reset for your ChatWow account. 
            If this was you, you can set a new password by clicking the button below.
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={url}>
              Reset Password
            </Button>
          </Section>

          <Text style={text}>
            This password reset link will expire in 24 hours. If you didn't request 
            a password reset, you can safely ignore this email.
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            If the button above doesn't work, copy and paste this URL into your browser:
          </Text>
          <Link href={url} style={link}>
            {url}
          </Link>

          <Text style={footer}>
            If you have any questions or need assistance, please contact our support team.
          </Text>

          <Text style={footer}>
            © {new Date().getFullYear()} ChatWow. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
  borderRadius: '8px',
};

const logoSection = {
  padding: '32px 20px',
  textAlign: 'center' as const,
};

const h1 = {
  color: '#1f2937',
  fontSize: '28px',
  fontWeight: '700',
  margin: '40px 0',
  padding: '0 20px',
  lineHeight: '1.3',
};

const text = {
  color: '#4b5563',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
  padding: '0 20px',
};

const buttonContainer = {
  padding: '27px 0',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#4F46E5',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 40px',
  lineHeight: '100%',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '42px 20px',
};

const footer = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '16px 0',
  padding: '0 20px',
};

const link = {
  color: '#4F46E5',
  fontSize: '14px',
  textDecoration: 'underline',
  wordBreak: 'break-all' as const,
  padding: '0 20px',
  display: 'block',
  marginBottom: '16px',
};
