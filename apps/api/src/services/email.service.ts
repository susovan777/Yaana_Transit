// Path: apps/api/src/services/email.service.ts
//
// Handles all transactional emails via Resend.
//
// Resend is a developer-first email API. No SMTP config,
// just an API key. Free tier: 3,000 emails/month.
// Production: Add your domain at resend.com/domains for
// emails to come from hello@yanatransit.in instead of
// the default onboarding@resend.dev
//
// Setup:
//   1. Create account at resend.com
//   2. Add RESEND_API_KEY to your .env
//   3. (Production) Verify your domain → update FROM_EMAIL below

import { Resend } from 'resend';

// Lazy-init: only create client when first email is sent.
// Avoids crashing at import if RESEND_API_KEY isn't set yet in dev.
let resend: Resend | null = null;

function getResend(): Resend {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) throw new Error('Missing RESEND_API_KEY in environment');
    resend = new Resend(apiKey);
  }
  return resend;
}

// ── Config ────────────────────────────────────────────────────────────

// Development: use Resend's test address (no domain needed)
// Production:  set RESEND_FROM_EMAIL=noreply@yanatransit.in in env
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev';

const APP_NAME = 'Yaana Transit';
const APP_URL = process.env.APP_URL ?? 'http://localhost:5173'; // admin panel URL

// ── Email: Invitation ─────────────────────────────────────────────────
// Sent when YAANA_ADMIN creates a new corporate user.
// The token in the link activates the account and lets user set password.

type SendInvitationParams = {
  toEmail: string;
  toName: string;
  companyName: string;
  invitedByName: string;
  activationToken: string; // raw token (goes in URL)
};

export async function sendInvitationEmail(
  params: SendInvitationParams
): Promise<void> {
  const { toEmail, toName, companyName, invitedByName, activationToken } =
    params;

  // Link goes to admin panel activation page
  const activationUrl = `${APP_URL}/activate?token=${activationToken}`;

  await getResend().emails.send({
    from: `${APP_NAME} <${FROM_EMAIL}>`,
    to: toEmail,
    subject: `You're invited to ${APP_NAME} — ${companyName}`,
    html: buildInvitationHtml({
      toName,
      companyName,
      invitedByName,
      activationUrl,
    }),
  });
}

// ── Email: Password Reset ─────────────────────────────────────────────
// Sent when a user requests a password reset.

type SendPasswordResetParams = {
  toEmail: string;
  toName: string;
  resetToken: string;
};

export async function sendPasswordResetEmail(
  params: SendPasswordResetParams
): Promise<void> {
  const { toEmail, toName, resetToken } = params;
  const resetUrl = `${APP_URL}/reset-password?token=${resetToken}`;

  await getResend().emails.send({
    from: `${APP_NAME} <${FROM_EMAIL}>`,
    to: toEmail,
    subject: `Reset your ${APP_NAME} password`,
    html: buildPasswordResetHtml({ toName, resetUrl }),
  });
}

// ── HTML templates ────────────────────────────────────────────────────
// Inline styles because email clients strip <style> tags.
// Keep it simple and readable — no heavy frameworks.

type InvitationHtmlParams = {
  toName: string;
  companyName: string;
  invitedByName: string;
  activationUrl: string;
};

function buildInvitationHtml(p: InvitationHtmlParams): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:#1C1F26;padding:28px 40px;">
            <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:0.5px;">
              Yaana Transit
            </p>
            <p style="margin:4px 0 0;font-size:12px;color:rgba(255,255,255,0.5);letter-spacing:2px;text-transform:uppercase;">
              Driven by Trust
            </p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px;">
            <p style="margin:0 0 8px;font-size:24px;font-weight:600;color:#1C1F26;">
              You're invited, ${p.toName}
            </p>
            <p style="margin:0 0 24px;font-size:15px;color:#6B7A90;line-height:1.6;">
              <strong>${p.invitedByName}</strong> has invited you to join the
              <strong>${p.companyName}</strong> account on Yaana Transit's corporate portal.
            </p>

            <p style="margin:0 0 12px;font-size:14px;color:#6B7A90;">
              Click the button below to activate your account and set your password.
              This link expires in <strong>48 hours</strong>.
            </p>

            <!-- CTA Button -->
            <table cellpadding="0" cellspacing="0" style="margin:28px 0;">
              <tr>
                <td style="background:#3A6AB6;border-radius:8px;">
                  <a href="${p.activationUrl}"
                     style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:0.3px;">
                    Activate My Account →
                  </a>
                </td>
              </tr>
            </table>

            <p style="margin:0;font-size:12px;color:#A0AEC0;line-height:1.6;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${p.activationUrl}" style="color:#3A6AB6;word-break:break-all;">${p.activationUrl}</a>
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 40px;border-top:1px solid #EDF2F7;">
            <p style="margin:0;font-size:12px;color:#A0AEC0;">
              If you didn't expect this invitation, you can safely ignore this email.
              This link will expire automatically after 48 hours.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

type PasswordResetHtmlParams = {
  toName: string;
  resetUrl: string;
};

function buildPasswordResetHtml(p: PasswordResetHtmlParams): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:#1C1F26;padding:28px 40px;">
            <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;">Yaana Transit</p>
            <p style="margin:4px 0 0;font-size:12px;color:rgba(255,255,255,0.5);letter-spacing:2px;text-transform:uppercase;">Driven by Trust</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px;">
            <p style="margin:0 0 8px;font-size:24px;font-weight:600;color:#1C1F26;">
              Reset your password
            </p>
            <p style="margin:0 0 24px;font-size:15px;color:#6B7A90;line-height:1.6;">
              Hi ${
                p.toName
              }, we received a request to reset your Yaana Transit password.
              Click below to choose a new one. This link expires in <strong>1 hour</strong>.
            </p>

            <table cellpadding="0" cellspacing="0" style="margin:28px 0;">
              <tr>
                <td style="background:#3A6AB6;border-radius:8px;">
                  <a href="${p.resetUrl}"
                     style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;">
                    Reset Password →
                  </a>
                </td>
              </tr>
            </table>

            <p style="margin:0;font-size:12px;color:#A0AEC0;line-height:1.6;">
              If you didn't request a password reset, ignore this email — your password won't change.<br><br>
              Link: <a href="${
                p.resetUrl
              }" style="color:#3A6AB6;word-break:break-all;">${p.resetUrl}</a>
            </p>
          </td>
        </tr>

        <tr>
          <td style="padding:20px 40px;border-top:1px solid #EDF2F7;">
            <p style="margin:0;font-size:12px;color:#A0AEC0;">
              © ${new Date().getFullYear()} Yaana Transit Pvt. Ltd. · Mumbai, India
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
