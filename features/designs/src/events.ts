export const EventListenerId = 'designs-feature';
export const OpenDesignStudioEvent = 'design-studio:open';

export interface OpenDesignStudioEventData {
  databaseId: string;
  designId: string;
}
