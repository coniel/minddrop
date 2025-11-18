export class DatabaseEntrySerializerNotRegisteredError extends Error {
  /**
   * @param id - The ID of the serializer that was not found.
   */
  constructor(id: string) {
    super(id);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DatabaseEntrySerializerNotRegisteredError);
    }

    this.name = 'DatabaseEntrySerializerNotRegisteredError';
    this.message = `no entry serializer with ID '${id}' is registered.`;

    Object.setPrototypeOf(
      this,
      DatabaseEntrySerializerNotRegisteredError.prototype,
    );
  }
}
