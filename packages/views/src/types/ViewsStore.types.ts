import { ViewInstance } from './ViewInstance.types';
import { View } from './View.types';

export interface ViewsStore {
  /**
   * An { [id]: View } map of views.
   */
  views: Record<string, View>;

  /**
   * An { [id]: ViewInstance | null } map of view instances.
   */
  instances: Record<string, ViewInstance>;

  /**
   * Adds a new view to the store.
   *
   * @param config The view.
   */
  setView(config: View): void;

  /**
   * Removes a view from the store.
   *
   * @param id The ID of the view to remove.
   */
  removeView(id: string): void;

  /**
   * Adds a view instance to the store.
   *
   * @param view The view instance to add.
   */
  setInstance(view: ViewInstance): void;

  /**
   * Removes a view instance from the store.
   *
   * @param viewId The ID of the view instance to remove.
   */
  removeInstance(viewId: string): void;

  /**
   * Loads view instances into the store.
   *
   * @param views The view instances to load.
   */
  loadInstances(views: ViewInstance[]): void;

  /**
   * Clears all data from the store.
   */
  clear(): void;
}
