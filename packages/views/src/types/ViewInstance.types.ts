export interface ViewInstance {
  /**
   * The ID of the view instance.
   */
  id: string;

  /**
   * The ID of the registered view rendered by this view instance.
   */
  view: string;

  /**
   * Timestamp at which the view instance was created.
   */
  createdAt: Date;

  /**
   * Timestamp at which the view instance was last updated.
   */
  updatedAt: Date;
}

export interface CreateViewInstanceData {
  /**
   * The ID of the view rendered by the view instance.
   */
  view: string;
}

export interface UpdateViewInstanceData {
  /**
   * The ID of the view rendered by the view instance.
   */
  view?: string;
}

export interface ViewInstanceChanges {
  updatedAt: Date;
  view?: string;
}

// An { [id]: ViewInstance | null } map,
// (null if view instance does not exist).
export type ViewInstanceMap<T extends ViewInstance = ViewInstance> = Record<
  string,
  T | null
>;

export type InstanceViewProps<P = {}> = P & ViewInstance;
