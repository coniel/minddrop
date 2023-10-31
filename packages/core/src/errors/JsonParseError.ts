export class JsonParseError extends Error {
  constructor(json: string) {
    const message = `Could not parse string as JSON: ${json}`;

    super(json);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, JsonParseError);
    }

    this.name = 'JsonParseError';
    this.message = message;

    Object.setPrototypeOf(this, JsonParseError.prototype);
  }
}
