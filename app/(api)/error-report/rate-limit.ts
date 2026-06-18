type RateLimitState = {
  count: number;
  resetAt: number;
};

const RATE_LIMIT_WINDOW_MS = 60_000;
const MAX_REPORTS_PER_WINDOW = 3;
const rateLimitStore = new Map<string, RateLimitState>();

export const clearErrorReportRateLimitStore = () => {
  rateLimitStore.clear();
};

export const cleanupErrorReportRateLimitStore = (now: number) => {
  if (rateLimitStore.size < 1000) return;

  rateLimitStore.forEach((state, key) => {
    if (state.resetAt <= now) {
      rateLimitStore.delete(key);
    }
  });
};

export const isErrorReportRateLimited = (key: string, now: number) => {
  const current = rateLimitStore.get(key);

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return false;
  }

  if (current.count >= MAX_REPORTS_PER_WINDOW) {
    return true;
  }

  current.count += 1;
  return false;
};
