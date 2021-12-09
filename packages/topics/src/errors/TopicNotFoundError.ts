export class TopicNotFoundError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TopicNotFoundError);
    }

    this.name = 'TopicNotFoundError';
    Object.setPrototypeOf(this, TopicNotFoundError.prototype);
  }
}
