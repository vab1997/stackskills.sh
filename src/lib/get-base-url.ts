export function getBaseURL(): string {
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL;
  // VERCEL_PROJECT_PRODUCTION_URL is the stable aliased domain (e.g. stackskills-sh.vercel.app)
  // VERCEL_URL is the deployment-specific URL — different origin → causes CORS
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}
