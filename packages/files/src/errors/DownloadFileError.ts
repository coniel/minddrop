export class DownloadFileError extends Error {
  /**
   * @param reason - The reason for which the download failed.
   */
  constructor(reason: string) {
    super(reason);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DownloadFileError);
    }

    this.name = 'DownloadFileError';
    this.message = `${reason}`;

    Object.setPrototypeOf(this, DownloadFileError.prototype);
  }
}
