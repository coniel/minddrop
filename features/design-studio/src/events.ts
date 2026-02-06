export const EventListenerId = 'design-studio-feature';
export const OpenDesignStudioEvent = 'design-studio:open';

export interface OpenDesignStudioEventData {
  databaseId: string;
  designId?: string;
}
