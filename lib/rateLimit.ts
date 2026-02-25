const bucket = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, maxPerMinute: number) {
  const now = Date.now();
  const item = bucket.get(key);
  if (!item || item.resetAt < now) {
    bucket.set(key, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (item.count >= maxPerMinute) return false;
  item.count += 1;
  return true;
}
