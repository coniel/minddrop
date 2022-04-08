import { Resource } from './Resource.types';

export interface ResourceConfig<TResource extends Resource = Resource> {
  /**
   * A unique identifier for the type of the resource
   * composed using the extension ID and resource type:
   * [extensionId]:[resourceType].
   */
  type: string;

  /**
   * Retrieves a resource from the local store.
   * Should return a resource by ID or `null` if
   * the resource does not exist.
   *
   * @param id The ID of the resource to retrieve.
   */
  get(id: string): TResource | null;

  /**
   * A callback fired once when the resources are loaded
   * on app startup.
   *
   * @param core A MindDrop core instance.
   * @param resources The loaded resources.
   */
  onLoad?(resources: TResource[]): void;

  /**
   * A callback fired whenever a resource matching the
   * given type is added, updated, or deleted.
   *
   * @param core A MindDrop core instance.
   * @param resource The changed resource.
   * @param deleted If `true`, the resource was permanently deleted.
   */
  onChange?(resource: TResource, deleted: boolean): void;

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
