import { describe, expect, it } from 'vitest';
import { ElementEmptyBehavior } from '../types';
import { getElementConfig, getElementConfigs } from './index';

// The static content capability of every element type. Elements
// which are always property bound are listed as false.
const staticContentSupport: Record<string, boolean> = {
  text: true,
  property: false,
  'data-view': true,
  container: false,
  'page-panel': false,
  root: false,
};

// The empty behaviour of every element type
const emptyBehaviors: Record<string, ElementEmptyBehavior> = {
  text: 'hide',
  property: 'hide',
  'data-view': 'none',
  container: 'none',
  'page-panel': 'none',
  root: 'none',
};

describe('element capabilities', () => {
  it('declares static content support on every element type', () => {
    getElementConfigs().forEach((config) => {
      expect(config.supportsStaticContent).toBe(
        staticContentSupport[config.type],
      );
    });
  });

  it('declares an empty behaviour on every element type', () => {
    getElementConfigs().forEach((config) => {
      expect(config.emptyBehavior).toBe(emptyBehaviors[config.type]);
    });
  });

  it('makes property elements property bound only', () => {
    // Property elements render a bound property by definition, so
    // they offer no static mode
    expect(getElementConfig('property').supportsStaticContent).toBe(false);
    expect(getElementConfig('text').supportsStaticContent).toBe(true);
  });

  it('always renders element types whose empty state is expected', () => {
    // Containers hold children rather than a value of their own
    expect(getElementConfig('container').emptyBehavior).toBe('none');
  });

  it('hides value bound element types when their value is empty', () => {
    // A design never shows an empty slot where a value would have
    // been, and never a design placeholder in its place
    expect(getElementConfig('text').emptyBehavior).toBe('hide');
    expect(getElementConfig('property').emptyBehavior).toBe('hide');
  });
});
