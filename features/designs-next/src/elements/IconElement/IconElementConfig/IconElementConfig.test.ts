import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignElementConfigs, Designs } from '@minddrop/designs-next';
import { cleanup } from '../../../test-utils';
import { IconElementConfig, IconElementType } from './IconElementConfig';

describe('IconElementConfig', () => {
  beforeEach(() => {
    DesignElementConfigs.register(IconElementConfig);
  });

  afterEach(() => {
    cleanup();
    DesignElementConfigs.Store.remove(IconElementType);
  });

  it('seeds new icon elements with the placeholder icon', () => {
    const element = Designs.createElement(IconElementType);

    expect(element).toHaveProperty('content', 'lucide:cat:default');
  });
});
