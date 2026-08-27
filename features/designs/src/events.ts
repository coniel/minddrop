import { DesignId } from '@minddrop/designs';

export const DesignsFeatureEventListenerId = 'feature-designs';

export const OpenDesignStudioEvent = 'designs:studio:open';

export interface OpenDesignStudioEventData {
  /**
   * The ID of the design to open. When omitted, the studio opens
   * on the design dashboard.
   */
  designId?: DesignId;
}

export interface DesignStudioViewProps extends OpenDesignStudioEventData {
  /**
   * Whether the open design was opened from the studio's dashboard.
   * Set by the studio itself as designs are opened and closed, so
   * that the open design survives the view unmounting.
   */
  fromDashboard?: boolean;
}

declare module '@minddrop/events/EventDataMap' {
  interface EventDataMap {
    'designs:studio:open': OpenDesignStudioEventData;
  }
}
