/**
 * Resolves once a condition holds, checking it every 10ms.
 *
 * @param condition - The condition to wait for.
 * @param timeoutMs - How long to wait before giving up.
 *
 * @throws {Error} If the condition does not hold within the timeout.
 */
export async function waitForCondition(
  condition: () => boolean,
  timeoutMs = 1000,
): Promise<void> {
  // Resolve the time to give up at
  const deadline = Date.now() + timeoutMs;

  // Check the condition until it holds
  while (!condition()) {
    // Throw if the timeout has passed
    if (Date.now() >= deadline) {
      throw new Error(`Condition not met within ${timeoutMs}ms`);
    }

    // Wait before checking again
    await Bun.sleep(10);
  }
}
