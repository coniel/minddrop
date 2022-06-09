export class TopicNotFoundError extends Error {
  /**
   * @param topicId The ID(s) of the missing topic(s).
   */
  constructor(topicId: string | string[]) {
    const ids = Array.isArray(topicId)
      ? topicId.map((id) => `'${id}'`).join(', ')
      : `'${topicId}'`;

    super(ids);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TopicNotFoundError);
    }

    this.name = 'TopicNotFoundError';
    this.message = `topic${
      Array.isArray(topicId) && topicId.length > 1
        ? `s ${ids} do`
        : ` ${ids} does`
    } not exist.`;

    Object.setPrototypeOf(this, TopicNotFoundError.prototype);
  }
}
