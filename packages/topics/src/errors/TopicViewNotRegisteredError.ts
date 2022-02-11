export class TopicViewNotRegisteredError extends Error {
  /**
   * @param viewId The ID of the topic view which is not registered.
   */
  constructor(viewId: string) {
    super(viewId);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TopicViewNotRegisteredError);
    }

    this.name = 'TopicViewNotRegisteredError';
    this.message = `topic view '${viewId}' is not registered. Make sure you register all topic views using \`Topics.registerView\`.`;

    Object.setPrototypeOf(this, TopicViewNotRegisteredError.prototype);
  }
}
