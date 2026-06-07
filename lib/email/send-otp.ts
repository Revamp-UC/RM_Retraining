export async function sendOtpEmail(to: string, name: string, otp: string): Promise<void> {
  const isDev = process.env.NODE_ENV !== 'production';
  const hasResend = !!process.env.RESEND_API_KEY;

  if (isDev || !hasResend) {
    console.log('\n┌─────────────────────────────────────┐');
    console.log(`│  OTP EMAIL (dev — not actually sent) │`);
    console.log(`│  To:   ${to.padEnd(28)} │`);
    console.log(`│  Name: ${name.padEnd(28)} │`);
    console.log(`│  OTP:  ${otp.padEnd(28)} │`);
    console.log('└─────────────────────────────────────┘\n');
    return;
  }

  const from = process.env.RESEND_FROM_EMAIL ?? 'RM Retraining <noreply@urbancompany.com>';

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `${otp} — Your RM Retraining OTP`,
      html: `
        <div style="font-family:sans-serif;max-width:420px;margin:auto;padding:32px">
          <h2 style="margin:0 0 8px">RM Retraining Login</h2>
          <p style="color:#555">Hi ${name},</p>
          <p style="color:#555">Your one-time password is:</p>
          <div style="font-size:40px;font-weight:700;letter-spacing:10px;text-align:center;
                      padding:20px;background:#f4f4f8;border-radius:10px;margin:20px 0">
            ${otp}
          </div>
          <p style="color:#888;font-size:13px">Valid for 10 minutes. Do not share this with anyone.</p>
        </div>
      `,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend error ${res.status}: ${body}`);
  }
}
