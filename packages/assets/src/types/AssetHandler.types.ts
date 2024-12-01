export interface AssetHandler {
  /**
   * A unique identifier for this handler.
   * Used to unregister the handler.
   */
  id: string;

  /**
   * Callback used to get a resource's assets path.
   *
   * Should return the path to the assets directory for the given resource ID.
   * If the resource does not belong to this handler, should return false.
   *
   * @param resourceId - The ID of the resource to get the assets path for.
   * @returns The path to the assets directory for the given resource ID, or false if the resource does not belong to this handler.
   */
  getResourceAssetsPath: (resourceId: string) => string | false;

  /**
   * Callback used to get a resource's assets path and ensure it exists.
   *
   * Should return the path to the assets directory for the given resource ID.
   * If the resource does not belong to this handler, should return false.
   *
   * If the directory does not exist, it should be created before returning the path.
   *
   * @param resourceId - The ID of the resource to ensure the assets path for.
   * @returns The path to the assets directory for the given resource ID, or false if the resource does not belong to this handler.
   */
  ensureResourceAssetsPath: (resourceId: string) => Promise<string | false>;
}
