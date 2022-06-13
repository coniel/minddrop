export class AdapterNotRegisteredError extends Error {
  /**
   * @param adapterName - The name of the adapter which has not been registered.
   */
  constructor(adapterName: string) {
    super(adapterName);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AdapterNotRegisteredError);
    }

    this.name = 'AdapterNotRegisteredError';
    this.message = `no ${adapterName} adapter registered.`;

    Object.setPrototypeOf(this, AdapterNotRegisteredError.prototype);
  }
}
