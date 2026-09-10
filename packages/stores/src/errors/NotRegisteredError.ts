export class NotRegisteredError extends Error {
  /**
   * The label of the registry which was looked up.
   */
  readonly registry: string;

  /**
   * The identifier which matched nothing.
   */
  readonly id: string;

  /**
   * @param registry - The label of the registry which was looked up.
   * @param id - The identifier which matched nothing.
   */
  constructor(registry: string, id: string) {
    super(id);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotRegisteredError);
    }

    this.name = 'NotRegisteredError';
    this.message = `no ${registry} matching '${id}' registered`;
    this.registry = registry;
    this.id = id;

    Object.setPrototypeOf(this, NotRegisteredError.prototype);
  }
}
