import { MindDropApi } from './MindDropApi.types';

export interface MindDropExtension {
  /**
   * Initializes the extension. Called on application startup.
   */
  initialize: (api: MindDropApi) => Promise<void>;

  /**
   * Optional cleanup method called when the extension is diasabled
   * but not removed from the application.
   */
  onDisable?: (api: MindDropApi) => Promise<void>;

  /**
   * Optional cleanup method called when the extension is removed
   * from the application.
   *
   * The `onDisable` callback will be called before this one, so this
   * callback only needs to handle cleanup that is specific to the
   * extension being removed.
   */
  onRemove?: (api: MindDropApi) => Promise<void>;
}
