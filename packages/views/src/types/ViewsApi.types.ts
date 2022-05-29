import { Core } from '@minddrop/core';
import { ViewConfig } from './ViewConfig.types';
import {
  RegisterViewEvent,
  RegisterViewEventCallback,
  UnregisterViewEvent,
  UnregisterViewEventCallback,
} from './ViewEvents.types';

export interface ViewsApi {
  /**
   * Returns a view config by ID.
   *
   * @param id - The ID of the view config to retrieve.
   * @returns The view's config.
   *
   * @throws ViewNotRegisteredError
   * Thrown if the requested view is not registered.
   */
  get(id: string): ViewConfig;

  /**
   * Registers a new view
   * Dispatches a `view:view:register` event.
   *
   * @param core - A MindDrop core instance.
   * @param config - The config of the view to register.
   */
  register(core: Core, config: ViewConfig): void;

  /**
   * Unregister's a view.
   * Dispatches a `views:view:unregister` event.
   *
   * @param core - A MindDrop core instance.
   * @param viewId - The ID of the view to unregister.
   *
   * @throws ViewNotRegisteredError
   * Thrown if the view is not registered.
   */
  unregister(core: Core, viewId: string): void;

  /**
   * Clears all registered views.
   * **Intended for use in tests only**.
   */
  clear(core: Core): void;

  /* ********************************** */
  /* *** addEventListener overloads *** */
  /* ********************************** */

  // Add 'views:view:register' event listener
  addEventListener(
    core: Core,
    type: RegisterViewEvent,
    callback: RegisterViewEventCallback,
  ): void;

  // Add 'views:view:unregister' event listener
  addEventListener(
    core: Core,
    type: UnregisterViewEvent,
    callback: UnregisterViewEventCallback,
  ): void;

  /* ************************************* */
  /* *** removeEventListener overloads *** */
  /* ************************************* */

  // Remove 'views:view:register' event listener
  removeEventListener(
    core: Core,
    type: RegisterViewEvent,
    callback: RegisterViewEventCallback,
  ): void;

  // Remove 'views:view:unregister' event listener
  removeEventListener(
    core: Core,
    type: UnregisterViewEvent,
    callback: UnregisterViewEventCallback,
  ): void;
}
