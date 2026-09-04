import { BoxElementType } from '../constants';
import { DesignElementComponent, DesignElementConfig } from '../types';

// Null-rendering stand-in component for the fixture config
const TestBoxComponent: DesignElementComponent = () => null;

// Config for the decorative box element type
export const boxElementConfig: DesignElementConfig = {
  type: BoxElementType,
  label: 'designsNext.elements.box.label',
  icon: 'square',
  group: 'layout',
  component: TestBoxComponent,
  defaultColumnSpan: 12,
  defaultRowSpan: 8,
};

export const elementConfigs = [boxElementConfig];
