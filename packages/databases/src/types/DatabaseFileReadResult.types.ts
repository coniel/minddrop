/**
 * The result of reading one of a database's files. Either the value
 * read, or whether the file is missing or could not be read.
 */
export type DatabaseFileReadResult<TValue> =
  // The file was read
  | { status: 'read'; value: TValue }
  // The file does not exist
  | { status: 'missing' }
  // The file exists but cannot be read, parsed or validated
  | { status: 'unreadable' };
