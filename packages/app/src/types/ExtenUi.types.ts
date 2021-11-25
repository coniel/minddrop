import { ComponentType } from 'react';
import {
  PrimaryNavItemConfig,
  SecondaryNavItemConfig,
  IconButtonConfig,
} from './UiComponentConfig.types';

export interface ExtendUiSidebar {
  /* ******************* */
  /* ***** Sidebar ***** */
  /* ******************* */
  extendUi(
    source: string,
    location: 'Sidebar:PrimaryNav:Item',
    element: PrimaryNavItemConfig | ComponentType,
  );
  extendUi(
    source: string,
    location: 'Sidebar:SecondaryNav:Item',
    element: SecondaryNavItemConfig | ComponentType,
  );
  extendUi(
    source: string,
    location: 'Sidebar:BottomToolbar:Item',
    element: IconButtonConfig | ComponentType,
  );

  /* ******************* */
  /* ****** Topic ****** */
  /* ******************* */
  extendUi(
    source: string,
    location: 'Topic:Header:Toolbar:Item',
    element: IconButtonConfig | ComponentType,
  );
}

export interface ExtendUiTopic {
  /* ******************* */
  /* ***** Sidebar ***** */
  /* ******************* */
  extendUi(
    source: string,
    location: 'Sidebar:PrimaryNav:Item',
    element: PrimaryNavItemConfig | ComponentType,
  );
  extendUi(
    source: string,
    location: 'Sidebar:SecondaryNav:Item',
    element: SecondaryNavItemConfig | ComponentType,
  );
  extendUi(
    source: string,
    location: 'Sidebar:BottomToolbar:Item',
    element: IconButtonConfig | ComponentType,
  );

  /* ******************* */
  /* ****** Topic ****** */
  /* ******************* */
  extendUi(
    source: string,
    location: 'Topic:Header:Toolbar:Item',
    element: IconButtonConfig | ComponentType,
  );
}

export type ExtendUi = ExtendUiSidebar & ExtendUiTopic;
