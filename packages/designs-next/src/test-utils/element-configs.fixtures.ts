import { DesignElementComponent, DesignElementConfig } from '../types';

export const TestElementType = 'test';

export const TestSlotElementType = 'test-slot';

export const TestSlotName = 'caption';

// Null-rendering stand-in component for the fixture config
const TestElementComponent: DesignElementComponent = () => null;

// Config for the fixture element type, declaring one slot
export const testElementConfig: DesignElementConfig = {
  type: TestElementType,
  label: 'designsNext.elements.box.label',
  icon: 'square',
  group: 'layout',
  component: TestElementComponent,
  defaultColumnSpan: 12,
  defaultRowSpan: 8,
  slots: [
    {
      name: TestSlotName,
      label: 'designsNext.elements.box.label',
      elementType: TestSlotElementType,
    },
  ],
};

// Config for the fixture type filling the slot, which is drawn by
// its parent rather than by the renderer.
export const testSlotElementConfig: DesignElementConfig = {
  type: TestSlotElementType,
  label: 'designsNext.elements.text.label',
  icon: 'text',
  defaultColumnSpan: 12,
  defaultRowSpan: 6,
};

export const elementConfigs = [testElementConfig, testSlotElementConfig];
