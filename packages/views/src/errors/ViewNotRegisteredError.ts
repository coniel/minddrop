export class ViewNotRegisteredError extends Error {
  /**
   * @param viewId The ID of the view which is not registered.
   */
  constructor(viewId: string) {
    super(viewId);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ViewNotRegisteredError);
    }

    this.name = 'ViewNotRegisteredError';
    this.message = `view '${viewId}' is not registered. Make sure you register all views using \`Views.register\`.`;

    Object.setPrototypeOf(this, ViewNotRegisteredError.prototype);
  }
}
