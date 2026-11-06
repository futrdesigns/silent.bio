import crypto from 'crypto';

/**
 * Creates a privacy-first salted daily rotating hash for a visitor.
 * Ensures no raw IP address is stored or retained.
 */
export function generateVisitorHash(ip: string, userAgent: string): string {
  const dateStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const baseSecret = process.env.ANALYTICS_SALT_SECRET || 'silent_bio_default_salt';
  const dailySalt = crypto.createHmac('sha256', baseSecret).update(dateStr).digest('hex');

  return crypto
    .createHash('sha256')
    .update(`${ip}:${userAgent}:${dailySalt}`)
    .digest('hex')
    .slice(0, 32);
}
