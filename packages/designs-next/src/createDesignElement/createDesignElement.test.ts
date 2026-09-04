import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { isEntityId } from '@minddrop/utils';
import { DesignElementConfigsStore } from '../DesignElementConfigsStore';
import { DesignElementConfigNotRegisteredError } from '../errors';
import { registerDesignElementConfig } from '../registerDesignElementConfig';
import { boxElementConfig } from '../test-utils';
import { createDesignElement } from './createDesignElement';

describe('createDesignElement', () => {
  beforeEach(() => {
    registerDesignElementConfig(boxElementConfig);
  });

  afterEach(() => {
    DesignElementConfigsStore.clear();
  });

  it('creates an element from the config defaults', () => {
    const element = createDesignElement(boxElementConfig.type);

    expect(element).toEqual({
      id: expect.any(String),
      type: boxElementConfig.type,
      column: 0,
      row: 0,
      columnSpan: boxElementConfig.defaultColumnSpan,
      rowSpan: boxElementConfig.defaultRowSpan,
      widthMode: 'fluid',
      naturalHeight: false,
    });
    expect(isEntityId(element.id, 'element')).toBe(true);
  });

  it('places the element at the given position', () => {
    const element = createDesignElement(boxElementConfig.type, {
      column: 4,
      row: 6,
    });

    expect(element.column).toBe(4);
    expect(element.row).toBe(6);
  });

  it('applies the config width mode and natural height defaults', () => {
    // A type defaulting to a pinned width and natural height
    registerDesignElementConfig({
      ...boxElementConfig,
      type: 'custom',
      defaultWidthMode: 'fixed-left',
      defaultNaturalHeight: true,
    });

    const element = createDesignElement('custom');

    expect(element.widthMode).toBe('fixed-left');
    expect(element.naturalHeight).toBe(true);
  });

  it('throws if the type is not registered', () => {
    expect(() => createDesignElement('unknown')).toThrow(
      DesignElementConfigNotRegisteredError,
    );
  });
});
