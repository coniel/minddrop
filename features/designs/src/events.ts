// -- View names --

export const DesignStudioViewName = 'designs:view:studio';

// -- Design Studio events --

export const DesignStudioEventListenerId = 'feature-design-studio';
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
   * The ID of the design to open in the editor. When omitted,
   * the studio opens at the dashboard.
   */
  designId?: string;
}
