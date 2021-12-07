import { EventListenerCallback } from '@minddrop/core';

export interface Api {
  /**
   * Opens a given view.
   *
   * @param view The view to open.
   */
  openView(view: View | ResourceView): void;
}
