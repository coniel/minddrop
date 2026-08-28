export const SettingsFeatureEventListenerId = 'feature-settings';

export const OpenSettingsEvent = 'settings:open';

export interface OpenSettingsEventData {
  /**
   * The ID of the registered settings view to open. When omitted,
   * the first registered settings view opens.
   */
  view?: string;
}

export type SettingsViewProps = OpenSettingsEventData;

declare module '@minddrop/events/EventDataMap' {
  interface EventDataMap {
    'settings:open': OpenSettingsEventData;
  }
}
