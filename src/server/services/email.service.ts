import { Resend } from 'resend';
import { logger } from '../utils/logger';
import { env } from '../config/env';
import * as templates from './email.templates';
import type { TemplateShipment } from './email.templates';
import { generateAllToBuffers } from './document.service';

// Lazy singleton — avoids initialising the SDK at module load (important in
// Next.js route handlers where modules may be imported before env is ready).
let _resend: Resend | null = null;

const getResend = (): Resend => {
  if (!env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is required to send email in production');
  }
  if (!_resend) _resend = new Resend(env.RESEND_API_KEY);
  return _resend;
};

interface SendEmailArgs {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendEmail = async ({ to, subject, html, text }: SendEmailArgs) => {
  if (!to || !to.trim()) {
    throw new Error('Email recipient is required');
  }
  if (!subject || !subject.trim()) {
    throw new Error('Email subject is required');
  }
  if (!html || !html.trim()) {
    throw new Error('Email HTML content is required');
  }

  if (process.env.NODE_ENV !== 'production') {
    logger.info(`[DEV] Email skipped — would have sent to ${to}`, { subject });
    return { id: 'dev-skipped' };
  }

  try {
    const { data, error } = await getResend().emails.send({
      from: `Accessiblexpress <${env.EMAIL_FROM}>`,
      to,
      subject,
      html,
      text: text || undefined,
    });

    if (error) {
      logger.error(`Email send failed to ${to}: ${error.message}`);
      throw new Error(error.message);
    }

    logger.info(`Email sent to ${to}: ${data?.id}`);
    return data;
  } catch (error) {
    logger.error(`Email send failed to ${to}: ${(error as Error).message}`);
    throw error;
  }
};

interface EmailUser {
  email: string;
  firstName?: string;
}

export const sendShipmentCreated = (user: EmailUser, shipment: TemplateShipment) =>
  sendEmail({
    to: user.email,
    subject: `Shipment Created — Tracking #${shipment.trackingNumber}`,
    html: `<h2>Hi ${user.firstName},</h2>
           <p>Your shipment has been created successfully.</p>
           <p><strong>Tracking Number:</strong> ${shipment.trackingNumber}</p>
           <p><strong>Status:</strong> ${shipment.status}</p>`,
  });

export const sendDeliveryConfirmation = (user: EmailUser, shipment: TemplateShipment) =>
  sendEmail({
    to: user.email,
    subject: `Package Delivered — Tracking #${shipment.trackingNumber}`,
    html: `<h2>Hi ${user.firstName},</h2>
           <p>Your shipment has been delivered successfully!</p>
           <p><strong>Tracking Number:</strong> ${shipment.trackingNumber}</p>
           <p><strong>Delivered At:</strong> ${new Date().toLocaleString()}</p>`,
  });

export const sendPasswordReset = (user: EmailUser, resetUrl: string) =>
  sendEmail({
    to: user.email,
    subject: 'Password Reset Request',
    html: `<h2>Hi ${user.firstName},</h2>
           <p>You requested a password reset. Click the link below (valid for 10 minutes):</p>
           <a href="${resetUrl}" style="background:#007bff;color:#fff;padding:10px 20px;text-decoration:none;border-radius:4px">Reset Password</a>
           <p>If you didn't request this, ignore this email.</p>`,
  });

export const sendEmailVerification = (user: EmailUser, verifyUrl: string) =>
  sendEmail({
    to: user.email,
    subject: 'Verify Your Email',
    html: `<h2>Welcome to Accessiblexpress, ${user.firstName}!</h2>
           <p>Please verify your email address:</p>
           <a href="${verifyUrl}" style="background:#28a745;color:#fff;padding:10px 20px;text-decoration:none;border-radius:4px">Verify Email</a>`,
  });

export const sendOTP = (user: EmailUser, otp: string) =>
  sendEmail({
    to: user.email,
    subject: 'Your OTP Code',
    html: `<h2>Hi ${user.firstName},</h2>
           <p>Your one-time passcode is:</p>
           <h1 style="letter-spacing:8px;font-size:40px">${otp}</h1>
           <p>Valid for 10 minutes. Do not share this code.</p>`,
  });

// ─── Shipment Alert Emails ────────────────────────────────────────────────────

export const sendPickedUpAlert = (shipment: TemplateShipment) =>
  sendEmail({
    to: shipment.recipient.email || '',
    subject: `📦 Package Picked Up — #${shipment.trackingNumber}`,
    html: templates.pickedUp(shipment),
  });

export const sendInTransitAlert = (shipment: TemplateShipment, eventLocation?: string) =>
  sendEmail({
    to: shipment.recipient.email || '',
    subject: `🚚 Your Package is In Transit — #${shipment.trackingNumber}`,
    html: templates.inTransit(shipment, eventLocation),
  });

export const sendOutForDeliveryAlert = (shipment: TemplateShipment) =>
  sendEmail({
    to: shipment.recipient.email || '',
    subject: `🛵 Out for Delivery Today — #${shipment.trackingNumber}`,
    html: templates.outForDelivery(shipment),
  });

export const sendDeliveredAlert = (shipment: TemplateShipment) =>
  sendEmail({
    to: shipment.recipient.email || '',
    subject: `✅ Package Delivered — #${shipment.trackingNumber}`,
    html: templates.delivered(shipment),
  });

export const sendDelayAlert = (shipment: TemplateShipment, event: { desc?: string; location?: string; date?: string; time?: string }) =>
  sendEmail({
    to: shipment.recipient.email || '',
    subject: `⚠️ Shipment Delay Notice — #${shipment.trackingNumber}`,
    html: templates.delayAlert(shipment, event),
  });

export const sendNewsletterWelcome = (email: string) =>
  sendEmail({
    to: email,
    subject: '🎉 Welcome to Accessiblexpress!',
    html: templates.newsletterWelcome(email),
  });

export const sendShipmentDocuments = async (shipment: TemplateShipment) => {
  if (!shipment.recipient?.email) return;

  if (process.env.NODE_ENV !== 'production') {
    logger.info(`[DEV] Shipment documents emails skipped — would have sent 3 emails to ${shipment.recipient.email}`, {
      trackingNumber: shipment.trackingNumber,
      emails: ['Waybill Receipt', 'Commercial Invoice', 'Packing List'],
    });
    return;
  }

  const { awb, invoice, packingList } = await generateAllToBuffers(shipment);
  const to = shipment.recipient.email;
  const tn = shipment.trackingNumber;

  const sendOne = async ({ subject, html, filename, content }: { subject: string; html: string; filename: string; content: Buffer }) => {
    const { data, error } = await getResend().emails.send({
      from: `Accessiblexpress <${env.EMAIL_FROM}>`,
      to,
      subject,
      html,
      attachments: [{ filename, content: content.toString('base64') }],
    });
    if (error) throw new Error(error.message);
    logger.info(`Document email sent [${filename}] to ${to}: ${data?.id}`);
    return data;
  };

  // Sequential — Resend allows max 2 req/sec
  await sendOne({ subject: `🛫 Your Waybill Receipt — #${tn}`, html: templates.awbEmail(shipment), filename: `AWB-${tn}.pdf`, content: awb });
  await sendOne({ subject: `🧾 Your Commercial Invoice — #${tn}`, html: templates.invoiceEmail(shipment), filename: `Invoice-${tn}.pdf`, content: invoice });
  await sendOne({ subject: `📦 Your Packing List — #${tn}`, html: templates.packingListEmail(shipment), filename: `PackingList-${tn}.pdf`, content: packingList });
};
