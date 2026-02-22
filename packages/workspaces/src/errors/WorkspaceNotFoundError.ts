export class WorkspaceNotFoundError extends Error {
  /**
   * @param id - The ID of the workspace that was not found.
   */
  constructor(type: string) {
    super(type);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, WorkspaceNotFoundError);
    }

    this.name = 'WorkspaceNotFoundError';
    this.message = `Workspace with ID ${type} not found.`;

    Object.setPrototypeOf(this, WorkspaceNotFoundError.prototype);
  }
}
