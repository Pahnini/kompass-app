const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 10;

const requestsByUser = new Map<string, number[]>();

export type RateLimitResult = { allowed: true } | { allowed: false; retryAfterSeconds: number };

export function checkNovaRateLimit(userId: string, now = Date.now()): RateLimitResult {
  const windowStart = now - WINDOW_MS;
  const recentRequests = (requestsByUser.get(userId) ?? []).filter(
    timestamp => timestamp > windowStart
  );

  if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    const oldestRequest = recentRequests[0] ?? now;
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((oldestRequest + WINDOW_MS - now) / 1000)),
    };
  }

  recentRequests.push(now);
  requestsByUser.set(userId, recentRequests);

  if (requestsByUser.size > 1000) {
    for (const [storedUserId, timestamps] of requestsByUser) {
      if (!timestamps.some(timestamp => timestamp > windowStart)) {
        requestsByUser.delete(storedUserId);
      }
    }
  }

  return { allowed: true };
}
