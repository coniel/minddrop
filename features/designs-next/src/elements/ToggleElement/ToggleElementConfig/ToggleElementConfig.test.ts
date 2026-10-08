import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignElementConfigs, Designs } from '@minddrop/designs-next';
import { cleanup } from '../../../test-utils';
import { ToggleElementConfig, ToggleElementType } from './ToggleElementConfig';

describe('ToggleElementConfig', () => {
  beforeEach(() => {
    DesignElementConfigs.register(ToggleElementConfig);
  });

  afterEach(() => {
    cleanup();
    DesignElementConfigs.Store.remove(ToggleElementType);
  });

  it('sizes a new toggle to a medium checkbox', () => {
    const element = Designs.createElement(ToggleElementType);

    // A medium checkbox is 16px square, four units
    expect(element.columnSpan).toBe(4);
    expect(element.rowSpan).toBe(4);
  });

  it('sizes the icon style as the checkbox', () => {
    const element = Designs.createElement(ToggleElementType);

    expect(
      ToggleElementConfig.resolveFixedSize?.({
        ...element,
        style: 'icon',
        size: 'lg',
      }),
    ).toEqual(
      ToggleElementConfig.resolveFixedSize?.({
        ...element,
        style: 'checkbox',
        size: 'lg',
      }),
    );
  });

  it('sizes the block to the control the style and size draw', () => {
    const element = Designs.createElement(ToggleElementType);

    // A large switch's track is 40 by 22px, ten by six units
    expect(
      ToggleElementConfig.resolveFixedSize?.({
        ...element,
        style: 'switch',
        size: 'lg',
      }),
    ).toEqual({ columnSpan: 10, rowSpan: 6 });
  });
});
