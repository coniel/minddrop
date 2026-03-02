import { DesignElementTemplate } from '@minddrop/designs';
import { FlatChildDesignElement } from './FlatDesignElement.types';

export interface DesignStudioDropEventData {
  'design-element-templates'?: DesignElementTemplate[];
  'design-elements'?: FlatChildDesignElement[];
}
