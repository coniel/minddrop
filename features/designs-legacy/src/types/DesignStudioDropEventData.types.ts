import { DesignElementTemplate } from '@minddrop/designs-legacy';
import { FlatChildDesignElement } from './FlatDesignElement.types';

export interface DesignStudioDropEventData {
  'design-element-templates'?: DesignElementTemplate[];
  'design-elements'?: FlatChildDesignElement[];
}
