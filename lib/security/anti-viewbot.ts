import crypto from 'crypto';

/**
 * Common bot user agent tokens to filter out scrapers, bots, and automated tools
 */
const BOT_SIGNATURES = [
  'bot',
  'spider',
  'crawl',
  'slurp',
  'googlebot',
  'bingbot',
  'yandex',
  'baiduspider',
  'facebookexternalhit',
  'twitterbot',
  'rogerbot',
  'linkedinbot',
  'embedly',
  'quora link preview',
  'showyoubot',
  'outbrain',
  'pinterest/0.',
  'developers.google.com/+/web/snippet',
  'slackbot',
  'vkshare',
  'w3c_validator',
  'redditbot',
  'applebot',
  'whatsapp',
  'flipboard',
  'tumblr',
  'bitlybot',
  'skypeuripreview',
  'nuzzel',
  'discordbot',
  'google page speed',
  'qwantify',
  'pinterestbot',
  'bitrix link preview',
  'xing-content-updater',
  'telegrambot',
  'headlesschrome',
  'phantomjs',
  'puppeteer',
  'playwright',
  'selenium',
  'postmanruntime',
  'python-requests',
  'curl',
  'wget',
];

/**
 * In-memory cooldown cache: `${profile}:${visitorHash}` -> timestamp
 * Prevents multiple counts from the same viewer within COOLDOWN_MS
 */
const RECENT_VIEWERS = new Map<string, number>();
const COOLDOWN_MS = 15 * 60 * 1000; // 15 minutes window

/**
 * Checks whether user agent indicates an automated bot or crawler
 */
export function isBot(userAgent: string | null): boolean {
  if (!userAgent) return true;
  const ua = userAgent.toLowerCase();
  return BOT_SIGNATURES.some((sig) => ua.includes(sig));
}

/**
 * Creates a privacy-preserving visitor identifier from IP and UA
 */
export function getVisitorHash(ip: string, userAgent: string): string {
  const salt = process.env.ANALYTICS_SALT_SECRET || 'silent_bio_antiviewbot_salt';
  return crypto
    .createHmac('sha256', salt)
    .update(`${ip}:${userAgent}`)
    .digest('hex')
    .slice(0, 24);
}

/**
 * Validates if a view is legitimate (non-bot, cooldown elapsed)
 */
export function shouldCountView(username: string, ip: string, userAgent: string): boolean {
  if (isBot(userAgent)) {
    return false;
  }

  const clean = username.toLowerCase().trim();
  const visitorHash = getVisitorHash(ip, userAgent);
  const cacheKey = `${clean}:${visitorHash}`;
  const now = Date.now();

  const lastSeen = RECENT_VIEWERS.get(cacheKey);
  if (lastSeen && now - lastSeen < COOLDOWN_MS) {
    return false; // In cooldown, do not count
  }

  // Update timestamp
  RECENT_VIEWERS.set(cacheKey, now);

  // Periodic cleanup if cache gets large
  if (RECENT_VIEWERS.size > 20000) {
    for (const [key, timestamp] of RECENT_VIEWERS.entries()) {
      if (now - timestamp > COOLDOWN_MS) {
        RECENT_VIEWERS.delete(key);
      }
    }
  }

  return true;
}
