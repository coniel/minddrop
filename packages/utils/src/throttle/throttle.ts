/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Throttles the given function for the given number of milliseconds.
 *
 * @param func - The function to throttle.
 * @param waitFor - How long to wait before the function can be called again.
 * @returns The throttled function.
 */
export function throttle<F extends (...args: any[]) => any>(
  func: F,
  waitFor: number,
): (...args: Parameters<F>) => Promise<ReturnType<F>> {
  const now = () => new Date().getTime();
  const resetStartTime = () => (startTime = now());
  let timeout: NodeJS.Timeout | null = null;
  let startTime: number = now() - waitFor;

  return (...args: Parameters<F>): Promise<ReturnType<F>> =>
    new Promise((resolve) => {
      const timeLeft = startTime + waitFor - now();

      if (timeout) {
        clearTimeout(timeout);
      }

      if (startTime + waitFor <= now()) {
        resetStartTime();
        resolve(func(...args));
      } else {
        timeout = setTimeout(() => {
          resetStartTime();
          resolve(func(...args));
        }, timeLeft);
      }
    });
}
