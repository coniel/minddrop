export class DropTypeNotRegisteredError extends Error {
  /**
   * @param type The type of drop which is not registered.
   */
  constructor(type: string) {
    super(type);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DropTypeNotRegisteredError);
    }

    this.name = 'DropTypeNotRegisteredError';
    this.message = `drop type '${type}' is not registerd. Make sure you register all drop types using the \`Drops.register\` method.`;

    Object.setPrototypeOf(this, DropTypeNotRegisteredError.prototype);
  }
}
