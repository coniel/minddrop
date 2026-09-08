import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignElementConfigs, Designs } from '@minddrop/designs-next';
import { cleanup } from '../../../test-utils';
import { TextElementConfig, TextElementType } from './TextElementConfig';

describe('TextElementConfig', () => {
  beforeEach(() => {
    DesignElementConfigs.register(TextElementConfig);
  });

  afterEach(() => {
    cleanup();
    DesignElementConfigs.Store.remove(TextElementType);
  });

  it('seeds new text elements with the placeholder text', () => {
    const element = Designs.createElement(TextElementType);

    expect(element).toHaveProperty('text', 'Text');
  });
});
