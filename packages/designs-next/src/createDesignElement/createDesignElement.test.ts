import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { isEntityId } from '@minddrop/utils';
import { DesignElementConfigsStore } from '../DesignElementConfigsStore';
import { DesignElementConfigNotRegisteredError } from '../errors';
import { registerDesignElementConfig } from '../registerDesignElementConfig';
import { testElementConfig } from '../test-utils';
import { createDesignElement } from './createDesignElement';

describe('createDesignElement', () => {
  beforeEach(() => {
    registerDesignElementConfig(testElementConfig);
  });

  afterEach(() => {
    DesignElementConfigsStore.clear();
  });

  it('creates an element from the config defaults', () => {
    const element = createDesignElement(testElementConfig.type);

    expect(element).toEqual({
      id: expect.any(String),
      type: testElementConfig.type,
      column: 0,
      row: 0,
      columnSpan: testElementConfig.defaultColumnSpan,
      rowSpan: testElementConfig.defaultRowSpan,
      widthMode: 'fluid',
      naturalHeight: false,
    });
    expect(isEntityId(element.id, 'element')).toBe(true);
  });

  it('places the element at the given position', () => {
    const element = createDesignElement(testElementConfig.type, {
      column: 4,
      row: 6,
    });

    expect(element.column).toBe(4);
    expect(element.row).toBe(6);
  });

  it('applies the config width mode and natural height defaults', () => {
    // A type defaulting to a pinned width and natural height
    registerDesignElementConfig({
      ...testElementConfig,
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
