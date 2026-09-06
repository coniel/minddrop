import { DesignElementComponent, DesignElementConfig } from '../types';

export const TestElementType = 'test';

// Null-rendering stand-in component for the fixture config
const TestElementComponent: DesignElementComponent = () => null;

// Config for the fixture element type
export const testElementConfig: DesignElementConfig = {
  type: TestElementType,
  label: 'designsNext.elements.box.label',
  icon: 'square',
  group: 'layout',
  component: TestElementComponent,
  defaultColumnSpan: 12,
  defaultRowSpan: 8,
};

export const elementConfigs = [testElementConfig];
