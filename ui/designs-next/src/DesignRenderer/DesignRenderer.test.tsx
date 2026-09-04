import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Design, UnitPixelSize } from '@minddrop/designs-next';
import {
  bodyDesignElement,
  cardDesign_1,
  coverDesignElement,
  iconDesignElement,
} from '@minddrop/designs-next/test-utils';
import { act, render } from '@minddrop/test-utils';
import { cleanup } from '../test-utils';
import { DesignRenderer } from './DesignRenderer';

// The created mock observers, in construction order
let observers: MockResizeObserver[] = [];

class MockResizeObserver implements ResizeObserver {
  callback: ResizeObserverCallback;

  targets: Element[] = [];

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
    observers.push(this);
  }

  observe(target: Element) {
    this.targets.push(target);
  }

  unobserve() {}

  disconnect() {}
}

/**
 * Reports a measured size for a node by driving the observer
 * observing it.
 *
 * @param node - The observed node.
 * @param dimension - The dimension to report.
 * @param value - The measured pixel value.
 */
function reportMeasuredSize(
  node: HTMLElement,
  dimension: 'offsetWidth' | 'offsetHeight',
  value: number,
) {
  // Define the reported dimension on the node
  Object.defineProperty(node, dimension, { value, configurable: true });

  // Find the observer observing the node
  const observer = observers.find((current) => current.targets.includes(node));

  // Drive the observer's callback with the node as its entry
  act(() => {
    observer?.callback(
      [{ target: node } as unknown as ResizeObserverEntry],
      observer,
    );
  });
}

describe('DesignRenderer', () => {
  beforeEach(() => {
    observers = [];
    vi.stubGlobal('ResizeObserver', MockResizeObserver);
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('renders a wrapper per element', () => {
    const { container } = render(
      <DesignRenderer design={cardDesign_1} width={480} />,
    );

    expect(container.querySelectorAll('.design-renderer-element')).toHaveLength(
      cardDesign_1.elements.length,
    );
  });

  it('sizes the container to the width and row layout height', () => {
    const { container } = render(
      <DesignRenderer design={cardDesign_1} width={480} />,
    );
    const renderer = container.querySelector('.design-renderer') as HTMLElement;

    expect(renderer.style.width).toBe('480px');
    expect(renderer.style.height).toBe(
      `${cardDesign_1.rows * UnitPixelSize}px`,
    );
  });

  it('positions elements at their resolved rects', () => {
    const { container } = render(
      <DesignRenderer design={cardDesign_1} width={480} />,
    );
    const cover = container.querySelector(
      '[data-element-id="element_cover"]',
    ) as HTMLElement;

    expect(cover.style.left).toBe('0px');
    expect(cover.style.width).toBe('480px');
    expect(cover.style.top).toBe('0px');
    expect(cover.style.height).toBe(
      `${coverDesignElement.rowSpan * UnitPixelSize}px`,
    );
  });

  it('measures its own width when none is given', () => {
    const { container } = render(<DesignRenderer design={cardDesign_1} />);
    const renderer = container.querySelector('.design-renderer') as HTMLElement;

    // No elements render until the width has been measured
    expect(container.querySelectorAll('.design-renderer-element')).toHaveLength(
      0,
    );

    // Report a measured container width
    reportMeasuredSize(renderer, 'offsetWidth', 480);

    const cover = container.querySelector(
      '[data-element-id="element_cover"]',
    ) as HTMLElement;

    expect(cover.style.width).toBe('480px');
  });

  it('gives natural elements a minimum height instead of a fixed one', () => {
    const { container } = render(
      <DesignRenderer design={cardDesign_1} width={480} />,
    );
    const body = container.querySelector(
      '[data-element-id="element_body"]',
    ) as HTMLElement;

    expect(body.style.minHeight).toBe(
      `${bodyDesignElement.rowSpan * UnitPixelSize}px`,
    );
    expect(body.style.height).toBe('');
  });

  it('skips elements without a registered renderer', () => {
    // A design whose only element has no registered renderer
    const design: Design = {
      ...cardDesign_1,
      elements: [{ ...coverDesignElement, type: 'unknown' }],
    };
    const { container } = render(
      <DesignRenderer design={design} width={480} />,
    );

    expect(container.querySelectorAll('.design-renderer-element')).toHaveLength(
      0,
    );
  });

  it('renders elements in array order', () => {
    const { container } = render(
      <DesignRenderer design={cardDesign_1} width={480} />,
    );
    const ids = Array.from(
      container.querySelectorAll('.design-renderer-element'),
    ).map((node) => node.getAttribute('data-element-id'));

    expect(ids).toEqual(cardDesign_1.elements.map((element) => element.id));
  });

  it('sizes aspect-locked designs from the render width', () => {
    // A full-height fluid element in a 3/2 locked design
    const design: Design = {
      ...cardDesign_1,
      aspectRatio: '3/2',
      elements: [{ ...coverDesignElement, rowSpan: 32 }],
    };
    const { container } = render(
      <DesignRenderer design={design} width={480} />,
    );
    const renderer = container.querySelector('.design-renderer') as HTMLElement;
    const cover = container.querySelector(
      '[data-element-id="element_cover"]',
    ) as HTMLElement;

    // 480px wide at 3/2 renders 320px tall, filled by the element
    expect(renderer.style.height).toBe('320px');
    expect(cover.style.top).toBe('0px');
    expect(cover.style.height).toBe('320px');
  });

  it('pins fixed-height elements in aspect-locked designs', () => {
    // A fluid cover with a bottom-pinned bar in rows 26-31
    const design: Design = {
      ...cardDesign_1,
      aspectRatio: '3/2',
      elements: [
        coverDesignElement,
        {
          ...iconDesignElement,
          id: 'element_bar',
          column: 0,
          columnSpan: 48,
          row: 26,
          rowSpan: 6,
          heightMode: 'fixed-bottom',
        },
      ],
    };
    const { container } = render(
      <DesignRenderer design={design} width={480} />,
    );
    const bar = container.querySelector(
      '[data-element-id="element_bar"]',
    ) as HTMLElement;

    // The bar keeps its unit height against the card's bottom edge
    expect(bar.style.height).toBe(`${6 * UnitPixelSize}px`);
    expect(parseFloat(bar.style.top)).toBeCloseTo(
      320 - (32 - 26) * UnitPixelSize,
    );
  });

  it('ignores natural height in aspect-locked designs', () => {
    // The natural body element inside a locked design
    const design: Design = { ...cardDesign_1, aspectRatio: '3/2' };
    const { container } = render(
      <DesignRenderer design={design} width={480} />,
    );
    const body = container.querySelector(
      '[data-element-id="element_body"]',
    ) as HTMLElement;

    // The body gets an engine-resolved height instead of a minimum
    expect(body.style.minHeight).toBe('');
    expect(body.style.height).not.toBe('');
  });

  it('stretches rows to fit measured natural heights', () => {
    const { container } = render(
      <DesignRenderer design={cardDesign_1} width={480} />,
    );
    const body = container.querySelector(
      '[data-element-id="element_body"]',
    ) as HTMLElement;

    // Report a measured content height for the natural body element
    reportMeasuredSize(body, 'offsetHeight', 100);

    const renderer = container.querySelector('.design-renderer') as HTMLElement;

    // The body's ten rows stretch from unit height to fit the
    // measured 100px.
    expect(renderer.style.height).toBe(
      `${(cardDesign_1.rows - bodyDesignElement.rowSpan) * UnitPixelSize + 100}px`,
    );
  });
});
