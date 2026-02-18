import { Design } from '@minddrop/designs';
import { PropertiesSchema, PropertyMap } from '@minddrop/properties';

export const EventListenerId = 'feature-design-studio';
export const OpenDesignStudioEvent = 'design-studio:open';

export interface OpenDesignStudioEventData {
  /**
   * The design to edit.
   */
  design: Design;

  /**
   * Callback fired when design changes are saved.
   */
  onSave: (design: Design) => void;

  /**
   * The label to display on the back button.
   */
  backButtonLabel?: string;

  /**
   * The event to dispatch when the back button is pressed.
   */
  backEvent?: string;

  /**
   * The label to display on the save button.
   */
  backEventData?: any;

  /**
   * The shcemas of the properties related to the design.
   */
  properties?: PropertiesSchema;

  /**
   * The values of the properties related to the design.
   */
  propertyValues?: PropertyMap;
}
