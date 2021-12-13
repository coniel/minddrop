import { ComponentType } from 'react';
import { Core } from '@minddrop/core';
import { UiComponentConfig } from './UiComponentConfig.types';
import { UiLocation } from './UiLocation';
import { View } from './View.types';
import { OpenViewEvent, OpenViewEventCallback } from './AppEvents.types';

export interface AppApi {
  /**
   * A component which will render UI extensions
   * for a given location.
   */
  Slot: ComponentType<{ location: UiLocation }>;

  /**
   * Opens a view in the app.
   *
   * @param core A MindDrop core instance.
   * @param view The view to open.
   */
  openView(core: Core, view: View): void;

  /**
   * Adds a new UI extension for a speficied location.
   *
   * @param core A MindDrop core instance.
   * @param location The location at which to extend the UI.
   * @param element The UI component config or React component with which to extend the UI.
   */
  addUiExtension(
    core: Core,
    location: UiLocation,
    element: UiComponentConfig | ComponentType,
  ): void;

  /**
   * Removes a UI extension.
   *
   * @param location The location for which the extension was added.
   * @param element The added UI component config or React component.
   */
  removeUiExtension(
    location: UiLocation,
    element: UiComponentConfig | ComponentType,
  ): void;

  /**
   * Removes all UI extensions added by the extension.
   * Optionally, a location can be specified to remove
   * UI extensions only from the specified location.
   *
   * @param core A MindDrop core instance.
   * @param location The location from which to remove the UI extensions.
   */
  removeAllUiExtensions(core: Core, location?: UiLocation): void;

  /* ********************************** */
  /* *** addEventListener overloads *** */
  /* ********************************** */

  // Add 'app:open-view' event listener
  addEventListener(
    core: Core,
    event: OpenViewEvent,
    callback: OpenViewEventCallback,
  );

  /* ************************************* */
  /* *** removeEventListener overloads *** */
  /* ************************************* */

  // Remove 'app:open-view' event listener
  removeEventListener(
    core: Core,
    type: OpenViewEvent,
    callback: OpenViewEventCallback,
  ): void;
}