import { describe, it, expect } from 'vitest';
import { validateUsername, normalizeUsername } from '../../lib/security/username-safety';
import { sanitizeCustomCss } from '../../lib/security/css-sandbox';
import { generateVisitorHash } from '../../lib/security/visitor-hash';
import { checkRateLimit } from '../../lib/security/rate-limit';

describe('Username Validation & Normalization', () => {
  it('accepts valid usernames', () => {
    expect(validateUsername('alice').valid).toBe(true);
    expect(validateUsername('john_doe').valid).toBe(true);
    expect(validateUsername('silent-99').valid).toBe(true);
  });

  it('rejects short usernames', () => {
    const res = validateUsername('hi');
    expect(res.valid).toBe(false);
    expect(res.error).toContain('at least 3 characters');
  });

  it('rejects reserved usernames', () => {
    expect(validateUsername('admin').valid).toBe(false);
    expect(validateUsername('settings').valid).toBe(false);
    expect(validateUsername('silentbio').valid).toBe(false);
  });

  it('rejects forbidden punctuation placements', () => {
    expect(validateUsername('.user').valid).toBe(false);
    expect(validateUsername('user-').valid).toBe(false);
  });

  it('normalizes homoglyphs correctly', () => {
    // Cyrillic 'а' normalized to Latin 'a'
    expect(normalizeUsername('pаss')).toBe('pass');
  });
});

describe('CSS Sandboxing', () => {
  it('scopes valid CSS rules', () => {
    const raw = '.card { color: red; }';
    const res = sanitizeCustomCss(raw, '.custom-profile');
    expect(res.safe).toBe(true);
    expect(res.sanitizedCss).toContain('.custom-profile .card { color: red; }');
  });

  it('blocks @import and url() patterns', () => {
    const attack1 = '@import url("https://evil.com/leak.css");';
    expect(sanitizeCustomCss(attack1).safe).toBe(false);

    const attack2 = 'body { background: url("https://evil.com/log.png"); }';
    expect(sanitizeCustomCss(attack2).safe).toBe(false);
  });

  it('blocks position: fixed to avoid viewport overlay spoofing', () => {
    const fixedCss = '.phish { position: fixed; top: 0; left: 0; }';
    expect(sanitizeCustomCss(fixedCss).safe).toBe(false);
  });
});

describe('Privacy-First Analytics Hash', () => {
  it('generates consistent 32-character hash for same day and inputs', () => {
    const hash1 = generateVisitorHash('192.168.1.1', 'Mozilla/5.0');
    const hash2 = generateVisitorHash('192.168.1.1', 'Mozilla/5.0');
    expect(hash1).toBe(hash2);
    expect(hash1.length).toBe(32);
  });

  it('generates different hashes for different IPs', () => {
    const hash1 = generateVisitorHash('192.168.1.1', 'Mozilla/5.0');
    const hash2 = generateVisitorHash('192.168.1.2', 'Mozilla/5.0');
    expect(hash1).not.toBe(hash2);
  });
});

describe('Rate Limiter', () => {
  it('allows requests within limit and throttles after excess', async () => {
    const id = `test-user-${Date.now()}`;
    const opts = { limit: 3, windowMs: 10_000 };

    const r1 = await checkRateLimit(id, opts);
    expect(r1.success).toBe(true);
    expect(r1.remaining).toBe(2);

    const r2 = await checkRateLimit(id, opts);
    expect(r2.success).toBe(true);
    expect(r2.remaining).toBe(1);

    const r3 = await checkRateLimit(id, opts);
    expect(r3.success).toBe(true);
    expect(r3.remaining).toBe(0);

    const r4 = await checkRateLimit(id, opts);
    expect(r4.success).toBe(false);
  });
});
