export function measure<T>(label: string, fn: () => T): T {
  if (process.env.NODE_ENV !== "development") return fn();

  const start = performance.now();
  const result = fn();
  const duration = performance.now() - start;

  console.debug(`[${label}] ${duration.toFixed(2)}ms`);
  return result;
}