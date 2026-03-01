import { DesignType } from '@minddrop/designs';

export const EventListenerId = 'feature-design-studio';
export const OpenDesignStudioEvent = 'design-studio:open';

export interface OpenDesignStudioEventData {
  /**
   * The label to display on the back button.
   */
  backButtonLabel?: string;

  /**
   * The event to dispatch when the back button is pressed.
   */
  backEvent?: string;

  /**
   * The data to pass to the back event.
   */
  backEventData?: any;

  /**
   * When set, a new design of this type is created and
   * opened automatically with the left panel set to
   * the elements tab.
   */
  newDesignType?: DesignType;
}
