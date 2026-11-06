interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// In-memory token bucket for local dev or when Upstash is unconfigured
const memoryStore = new Map<string, RateLimitRecord>();

export interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

export async function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = { limit: 60, windowMs: 60_000 }
): Promise<{ success: boolean; remaining: number; reset: number }> {
  const now = Date.now();
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (upstashUrl && upstashToken) {
    try {
      // Direct REST call to Upstash to avoid external client overhead if desired
      const res = await fetch(`${upstashUrl}/pipeline`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${upstashToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          ['INCR', `ratelimit:${identifier}`],
          ['PTTL', `ratelimit:${identifier}`],
        ]),
      });

      if (res.ok) {
        const data = await res.json();
        const currentCount = data[0]?.result || 1;
        let ttl = data[1]?.result;

        if (ttl === -1) {
          // Set expiry if key had none
          await fetch(`${upstashUrl}/PEXPIRE/ratelimit:${identifier}/${options.windowMs}`, {
            headers: { Authorization: `Bearer ${upstashToken}` },
          });
          ttl = options.windowMs;
        }

        const remaining = Math.max(0, options.limit - currentCount);
        return {
          success: currentCount <= options.limit,
          remaining,
          reset: now + (ttl > 0 ? ttl : options.windowMs),
        };
      }
    } catch {
      // Fallback to in-memory on network failure
    }
  }

  // In-memory sliding window fallback
  const record = memoryStore.get(identifier);
  if (!record || now > record.resetAt) {
    memoryStore.set(identifier, { count: 1, resetAt: now + options.windowMs });
    return { success: true, remaining: options.limit - 1, reset: now + options.windowMs };
  }

  record.count += 1;
  const remaining = Math.max(0, options.limit - record.count);
  return {
    success: record.count <= options.limit,
    remaining,
    reset: record.resetAt,
  };
}
