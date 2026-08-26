export const SearchFeatureEventListenerId = 'search-feature';
export const OpenSearchDialogEvent = 'search:dialog:open';

declare module '@minddrop/events/EventDataMap' {
  interface EventDataMap {
    'search:dialog:open': void;
  }
}
