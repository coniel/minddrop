export interface ResourceConnector {
  /**
   * A unique identifier for the type of the resource
   * composed using the extension ID and resource type:
   * [extensionId]:[resourceType].
   */
  type: string;

  /**
   * A callback fired once when the resources are loaded
   * on app startup.
   *
   * @param core A MindDrop core instance.
   * @param resources The loaded resources.
   */
  onLoad?<R>(resources: R[]): void;

  /**
   * A callback fired whenever a resource matching the
   * given type is added, updated, or deleted.
   *
   * @param core A MindDrop core instance.
   * @param change The change object.
   * @param deleted If `true`, the resource was permanently deleted.
   */
  onChange?<R>(change: R, deleted: boolean): void;

  /**
   * If provided, an event listener will be added for this
   * event type. When such an event is fired, the attached
   * resource will be added to the persistent store. The
   * event data must be the resource itself.
   */
  createEvent?: string;

  /**
   * If provided, an event listener will be added for this
   * event type. When such an event is fired, the attached
   * resource will be updated in the persistent store. The
   * event data must be a `ResourceChange`.
   */
  updateEvent?: string;

  /**
   * If provided, an event listener will be added for this
   * event type. When such an event is fired, the attached
   * resource will be permanently deleted from the persistent
   * store. The event data must be the resource itself.
   */
  deleteEvent?: string;
}
