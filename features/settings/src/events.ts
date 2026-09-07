export const SettingsFeatureEventListenerId = 'feature-settings';

export const OpenSettingsEvent = 'settings:open';

export interface OpenSettingsEventData {
  /**
   * The ID of the registered settings view to open. When omitted,
   * the dialog opens on the last selected settings view, falling
   * back to the first registered one.
   */
  view?: string;
}

declare module '@minddrop/events/EventDataMap' {
  interface EventDataMap {
    'settings:open': OpenSettingsEventData;
  }
}
