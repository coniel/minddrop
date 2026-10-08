import { BackgroundSettings, DesignElement } from '@minddrop/designs-next';

export interface CollectionElement extends DesignElement, BackgroundSettings {
  /**
   * The type of the view the element embeds. Absent means gallery.
   */
  viewType?: string;
}
