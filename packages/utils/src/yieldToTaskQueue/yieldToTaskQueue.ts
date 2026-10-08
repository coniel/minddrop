/**
 * Resolves on the next task, once every queued microtask has run.
 * Keeps working under fake timers.
 *
 * @returns A promise resolving on the next task.
 */
export function yieldToTaskQueue(): Promise<void> {
  return new Promise((resolve) => {
    // Post a message to a fresh channel. Message delivery is a task,
    // and unlike a timer it is not faked.
    const channel = new MessageChannel();

    // Close the channel and resolve when the message arrives
    channel.port1.onmessage = () => {
      channel.port1.close();
      resolve();
    };

    channel.port2.postMessage(undefined);
  });
}
