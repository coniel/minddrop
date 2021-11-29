import { ComponentType } from 'react';
import {
  IconButtonConfig,
  PrimaryNavItemConfig,
  SecondaryNavItemConfig,
} from '@minddrop/app';

export interface ExtensionExtendUiApi {
  /**
   *
   * @param location The location at which to insert the element.
   * @param element The UI element.
   */
  // Sidebar UI extensions
  extendUi(
    location: 'Sidebar:PrimaryNav:Item',
    element: PrimaryNavItemConfig | ComponentType,
  ): void;
  extendUi(
    location: 'Sidebar:SecondaryNav:Item',
    element: SecondaryNavItemConfig | ComponentType,
  ): void;
  extendUi(
    location: 'Sidebar:BottomToolbar:Item',
    element: IconButtonConfig | ComponentType,
  ): void;

  // Topic UI extensions
  extendUi(
    location: 'Topic:Header:Toolbar:Item',
    element: IconButtonConfig | ComponentType,
  );
}
