export class EventListenerNotRegisteredError extends Error {
  /**
   * @param eventName - The event name.
   * @param listenerId - The listener ID.
   */
  constructor(eventName: string, listenerId: string) {
    const message = `No such listener (${listenerId}) registered for event '${eventName}'.`;

    super();

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, EventListenerNotRegisteredError);
    }

    this.name = 'EventListenerNotRegisteredError';
    this.message = message;

    Object.setPrototypeOf(this, EventListenerNotRegisteredError.prototype);
  }
}
