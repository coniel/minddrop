import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignElementConfigs, Designs } from '@minddrop/designs-next';
import { cleanup } from '../../../test-utils';
import {
  HeadingElementConfig,
  HeadingElementType,
} from './HeadingElementConfig';

describe('HeadingElementConfig', () => {
  beforeEach(() => {
    DesignElementConfigs.register(HeadingElementConfig);
  });

  afterEach(() => {
    cleanup();
    DesignElementConfigs.Store.remove(HeadingElementType);
  });

  it('seeds new headings with the placeholder text', () => {
    const element = Designs.createElement(HeadingElementType);

    expect(element).toHaveProperty('text', 'Heading');
  });
});
