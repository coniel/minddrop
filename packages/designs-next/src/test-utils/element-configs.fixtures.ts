import { BoxElementType } from '../constants';
import { DesignElementConfig } from '../types';

// Config for the decorative box element type
export const boxElementConfig: DesignElementConfig = {
  type: BoxElementType,
  label: 'designsNext.elements.box.label',
  icon: 'square',
  group: 'layout',
  defaultColumnSpan: 12,
  defaultRowSpan: 8,
};

export const elementConfigs = [boxElementConfig];
