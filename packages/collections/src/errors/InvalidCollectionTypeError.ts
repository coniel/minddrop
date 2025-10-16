import { BaseCollectionTypeConfig } from '../types';

export class InvalidCollectionTypeError extends Error {
  /**
   * @param path - The collection path.
   * @param expectedType - The expected type of the collection.
   * @param receivedType - The actual type of the collection.
   */
  constructor(
    path: string,
    expectedType: BaseCollectionTypeConfig['type'],
    receivedType?: string,
  ) {
    const message = `Expected collection of type '${expectedType}' but received type '${receivedType}'.`;

    super(path);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidCollectionTypeError);
    }

    this.name = 'InvalidCollectionTypeError';
    this.message = message;

    Object.setPrototypeOf(this, InvalidCollectionTypeError.prototype);
  }
}
