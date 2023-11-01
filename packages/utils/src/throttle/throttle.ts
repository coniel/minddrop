/**
 * Throttles the given function for the given number
 * of milliseconds.
 *
 * @param func - the function to throttle.
 * @param waitFor - how long to wait for before the function can be called again.
 * @returns The throttled function.
 */
export function throttle<F extends (...args: any[]) => any>(
  func: F,
  waitFor: number,
) {
  const now = () => new Date().getTime();
  const resetStartTime = () => (startTime = now());
  let timeout: any;
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
