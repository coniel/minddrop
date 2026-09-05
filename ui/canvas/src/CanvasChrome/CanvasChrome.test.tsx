import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@minddrop/test-utils';
import { CanvasChrome } from './CanvasChrome';

describe('CanvasChrome', () => {
  afterEach(cleanup);

  it('renders its contents on the counter-scaled element', () => {
    const { container } = render(<CanvasChrome>contents</CanvasChrome>);

    expect(container.querySelector('.ui-canvas-chrome')?.textContent).toBe(
      'contents',
    );
  });

  it('anchors the top left corner by default', () => {
    const { container } = render(<CanvasChrome>contents</CanvasChrome>);

    expect(
      container.querySelector('.ui-canvas-chrome-origin-top-left'),
    ).not.toBeNull();
  });

  it('anchors the given origin', () => {
    const { container } = render(
      <CanvasChrome origin="bottom-right">contents</CanvasChrome>,
    );

    expect(
      container.querySelector('.ui-canvas-chrome-origin-bottom-right'),
    ).not.toBeNull();
  });

  it('applies the given class name', () => {
    const { container } = render(
      <CanvasChrome className="custom">contents</CanvasChrome>,
    );

    expect(container.querySelector('.ui-canvas-chrome.custom')).not.toBeNull();
  });
});
