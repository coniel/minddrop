import { ComponentType } from 'react';
import { UiComponentConfig } from './UiComponentConfig.types';

export interface BaseUiExtension {
  id: string;
  type: 'config' | 'component';
  location: string;
  element: UiComponentConfig | ComponentType;
  source: string;
}

export interface UiExtensionConfig extends BaseUiExtension {
  type: 'config';
  element: UiComponentConfig;
}

export interface UiExtensionElement extends BaseUiExtension {
  type: 'component';
  element: ComponentType;
}

export type UiExtension = UiExtensionConfig | UiExtensionElement;
