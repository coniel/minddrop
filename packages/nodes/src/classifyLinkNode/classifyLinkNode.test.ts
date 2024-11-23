import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { setup, cleanup } from '../test-utils';
import { classifyLinkNode } from './classifyLinkNode';
import { registerNodeClassifierConfig } from '../NodeClassifierConfigsStore';
import { LinkNode } from '../types';

const mapNode: LinkNode = {
  type: 'link',
  layout: 'link',
  id: 'id-1',
  url: 'https://www.google.com/maps/place/Helsinki/@60.1100614,24.8538816,11z/data=!3m1!4b1!4m6!3m5!1s0x46920bc796210691:0xcd4ebd843be2f763!8m2!3d60.1698557!4d24.9383791!16zL20vMDNraG4?entry=ttu',
};

const videoNode: LinkNode = {
  type: 'link',
  layout: 'link',
  id: 'id-2',
  url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
};

const linkNode: LinkNode = {
  type: 'link',
  layout: 'link',
  id: 'id-3',
  url: 'https://example.com',
};

describe('classifyNode', () => {
  beforeEach(() => {
    setup();

    // Register some classifiers
    registerNodeClassifierConfig({
      id: 'map',
      nodeType: 'link',
      layout: 'map',
      patterns: ['*.google.com/maps/*'],
    });
    registerNodeClassifierConfig({
      id: 'video',
      nodeType: 'link',
      layout: 'video',
      callback: (node) => !!node.url?.includes('youtube.com/watch'),
    });
  });

  afterEach(cleanup);

  it('classifies a node using patterns', () => {
    const layout = classifyLinkNode(mapNode);

    expect(layout).toBe('map');
  });

  it('classifies a node using callback', () => {
    const layout = classifyLinkNode(videoNode);

    expect(layout).toBe('video');
  });

  it('falls back to the default layout', () => {
    const layout = classifyLinkNode(linkNode);

    expect(layout).toBe('link');
  });
});
