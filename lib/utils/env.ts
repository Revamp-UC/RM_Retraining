// Environment variable validation — call this at server startup
export function validateEnv() {
  const required = [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'GEMINI_API_KEY',
    'SESSION_EXPIRY_HOURS',
  ];

  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n  ${missing.join('\n  ')}\n\nCopy .env.local.example to .env.local and fill in the values.`,
    );
  }
}
