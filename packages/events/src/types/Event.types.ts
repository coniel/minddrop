export interface Event<TData = unknown> {
  /**
   * The event name.
   */
  name: string;

  /**
   * The event data if it contains any.
   */
  data: TData;

  /**
   * Stops the invocation of event listeners after the
   * current one completes.
   */
  stopPropagation(): void;

  /**
   * Skips the invocation of the specified event listeners
   * after the current one completes.
   */
  skipPropagation(listenerId: string | string[]): void;
}
