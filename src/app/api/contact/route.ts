import type { NextRequest } from 'next/server';
import { env } from '@/server/config/env';
import { AppError, errorResponse, jsonMessage } from '@/server/middleware/errorHandler';
import { contactLimiter, getClientIp } from '@/server/middleware/rateLimit';
import { logRoute } from '@/server/middleware/requestLogger';
import { sendEmail } from '@/server/services/email.service';
import { logger } from '@/server/utils/logger';

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  try {
    await contactLimiter(request);

    const { name, email, company, subject, message } = (await request.json().catch(() => ({}))) as Record<
      string,
      string | undefined
    >;

    if (!name || !email || !message) {
      throw new AppError('Name, email, and message are required', 400);
    }

    const teamEmail = env.CONTACT_EMAIL || env.EMAIL_FROM;

    // Notify team
    await sendEmail({
      to: teamEmail,
      subject: `Contact Form: ${subject || 'New enquiry'} — ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <table style="border-collapse:collapse;width:100%">
          <tr><td style="padding:8px;font-weight:bold">Name</td><td style="padding:8px">${name}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Email</td><td style="padding:8px">${email}</td></tr>
          ${company ? `<tr><td style="padding:8px;font-weight:bold">Company</td><td style="padding:8px">${company}</td></tr>` : ''}
          <tr><td style="padding:8px;font-weight:bold">Subject</td><td style="padding:8px">${subject || '—'}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Message</td><td style="padding:8px">${(message || '').replace(/\n/g, '<br>')}</td></tr>
        </table>
      `,
    });

    // Auto-reply to sender (non-blocking)
    sendEmail({
      to: email,
      subject: 'We received your message — Accessiblexpress',
      html: `<p>Hi ${name},</p>
             <p>Thanks for reaching out. We've received your message and will get back to you within 1–2 business days.</p>
             <p>— The Accessiblexpress Team</p>`,
    }).catch((err) => logger.warn(`Contact auto-reply failed: ${err.message}`));

    logger.info(`Contact form submitted by ${email} — IP: ${ip}`);
    logRoute(request, 200, { body: { email } });
    return jsonMessage('Message received. We will get back to you shortly.');
  } catch (err) {
    const status = (err as { statusCode?: number }).statusCode ?? 500;
    logRoute(request, status);
    return errorResponse(err);
  }
}
