import { DesignElement, TextSettings } from '@minddrop/designs-next';
import { UrlPart } from '@minddrop/utils';

export interface LinkElement extends DesignElement, TextSettings {
  /**
   * The parts of the address shown. Absent means all of them.
   */
  urlParts?: UrlPart[];
}
