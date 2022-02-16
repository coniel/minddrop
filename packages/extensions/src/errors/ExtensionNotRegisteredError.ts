export class ExtensionNotRegisteredError extends Error {
  /**
   * @param extensionId The ID of the extension which is not registered.
   */
  constructor(extensionId: string) {
    super(extensionId);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ExtensionNotRegisteredError);
    }

    this.name = 'ExtensionNotRegisteredError';
    this.message = `extension '${extensionId}' is not registered. Make sure you register all extensions using \`Extensions.register\`.`;

    Object.setPrototypeOf(this, ExtensionNotRegisteredError.prototype);
  }
}
