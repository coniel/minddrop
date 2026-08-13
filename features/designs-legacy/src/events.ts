import { TranslationKey } from '@minddrop/i18n';

// -- View names --

export const DesignStudioViewName = 'designs:view:studio';

// -- Design Studio events --

export const DesignStudioEventListenerId = 'feature-design-studio';
export const OpenDesignStudioEvent = 'design-studio:open';

export interface OpenDesignStudioEventData {
  /**
   * The label to display on the back button.
   */
  backButtonLabel?: TranslationKey;

  /**
   * The event to dispatch when the back button is pressed.
   */
  backEvent?: string;

  /**
   * The data to pass to the back event. Typed loosely because the
   * payload shape depends on the event being dispatched.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  backEventData?: any;

  /**
   * The ID of the design to open in the editor. When omitted,
   * the studio opens at the dashboard.
   */
  designId?: string;
}
