import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import type { UserVerification } from '@domain/base/user-verification/user-verification.domain';
import { UserVerificationFactory } from '@domain/base/user-verification/user-verification.factory';
import { Logo } from '../asset/logo';

type DefaultProps = {
  userVerification: UserVerification;
};

export default function TemplateSendVerificationCode({ userVerification }: DefaultProps) {
  userVerification ??= UserVerificationFactory.mock({});

  const verificationCode = userVerification.code;

  return (
    <Html>
      <Head />
      <Preview>Your verification code for ChatWow</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoSection}>
            <Logo width={120} height={40} />
          </Section>

          <Heading style={h1}>Verification Code</Heading>

          <Text style={text}>
            You requested a verification code for your ChatWow account. 
            Use the code below to complete your verification:
          </Text>

          <Section style={codeContainer}>
            <Text style={code}>{verificationCode}</Text>
          </Section>

          <Text style={text}>
            This verification code will expire in 10 minutes. If you didn't request 
            this code, you can safely ignore this email.
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            For your security, never share this code with anyone. Our team will 
            never ask you for this code.
          </Text>

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

const codeContainer = {
  padding: '27px 20px',
  textAlign: 'center' as const,
  backgroundColor: '#f9fafb',
  margin: '20px',
  borderRadius: '8px',
  border: '2px dashed #e5e7eb',
};

const code = {
  color: '#1f2937',
  fontSize: '32px',
  fontWeight: '700',
  letterSpacing: '8px',
  fontFamily: 'monospace',
  margin: '0',
  padding: '0',
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
