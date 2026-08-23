import { describe, expect, it } from 'vitest';
import { ElementEmptyBehavior } from '../types';
import { getElementConfig, getElementConfigs } from './index';

// The static content capability of every element type. Elements
// which are always property bound are listed as false.
const staticContentSupport: Record<string, boolean> = {
  text: true,
  'formatted-text': false,
  number: true,
  date: true,
  badges: true,
  image: true,
  'image-viewer': true,
  icon: true,
  url: false,
  webview: false,
  view: false,
  editor: false,
  property: false,
  container: false,
  'page-panel': false,
  root: false,
};

// The empty behaviour of every element type
const emptyBehaviors: Record<string, ElementEmptyBehavior> = {
  text: 'hide',
  'formatted-text': 'hide',
  number: 'hide',
  date: 'hide',
  url: 'hide',
  badges: 'hide',
  image: 'hide',
  'image-viewer': 'hide',
  icon: 'hide',
  webview: 'hide',
  view: 'hide',
  property: 'hide',
  editor: 'none',
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

  it('makes URL elements property bound only', () => {
    // A fixed link belongs in a text element, so the URL element
    // offers no static mode
    expect(getElementConfig('url').supportsStaticContent).toBe(false);
    expect(getElementConfig('text').supportsStaticContent).toBe(true);
  });

  it('makes formatted text elements property bound only', () => {
    // Formatting is authored in an editor, which only a bound
    // property provides
    expect(getElementConfig('formatted-text').supportsStaticContent).toBe(
      false,
    );
  });

  it('always renders element types whose empty state is expected', () => {
    // An empty editor is where writing starts, and containers hold
    // children rather than a value of their own
    expect(getElementConfig('editor').emptyBehavior).toBe('none');
    expect(getElementConfig('container').emptyBehavior).toBe('none');
  });

  it('hides value bound element types when their value is empty', () => {
    // A design never shows an empty slot where a value would have
    // been, and never a design placeholder in its place
    expect(getElementConfig('text').emptyBehavior).toBe('hide');
    expect(getElementConfig('url').emptyBehavior).toBe('hide');
  });
});
