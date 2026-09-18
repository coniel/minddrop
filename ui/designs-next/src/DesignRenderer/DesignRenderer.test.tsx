import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  Design,
  DesignElementComponent,
  DesignElementConfig,
  DesignElementConfigs,
  Designs,
} from '@minddrop/designs-next';
import {
  DesignElementFixtures,
  DesignFixtures,
} from '@minddrop/designs-next/test-utils';
import { PropertiesSchema } from '@minddrop/properties';
import { act, render } from '@minddrop/test-utils';
import { cleanup } from '../test-utils';
import { useElementValue } from '../useElementValue';
import { DesignRenderer } from './DesignRenderer';

const { cardDesign_1, design_heading, design_stacked } = DesignFixtures;
const {
  bodyDesignElement,
  coverDesignElement,
  designElement_heading,
  designElement_stackedFooter,
  iconDesignElement,
} = DesignElementFixtures;

// An element type rendering the value of the property it maps to,
// standing in for the real content elements.
const ValueElementType = 'value';

const ValueElement: DesignElementComponent = ({ element }) => (
  <div>{useElementValue(element)}</div>
);

const valueElementConfig: DesignElementConfig = {
  type: ValueElementType,
  label: 'designsNext.elements.text.label',
  icon: 'text',
  group: 'content',
  component: ValueElement,
  defaultColumnSpan: 12,
  defaultRowSpan: 4,
};

const titleProperties: PropertiesSchema = [{ type: 'title', name: 'Title' }];

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

/**
 * Finds the wrapper of a rendered element.
 *
 * @param container - The render container.
 * @param elementId - The element's ID.
 * @returns The element's wrapper node.
 */
function getElementWrapper(
  container: HTMLElement,
  elementId: string,
): HTMLElement {
  return container.querySelector(
    `[data-element-id="${elementId}"]`,
  ) as HTMLElement;
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

  it('renders a mapped element from the property values', () => {
    DesignElementConfigs.register(valueElementConfig);

    const design: Design = {
      ...design_heading,
      elements: [
        { ...designElement_heading, type: ValueElementType, property: 'Title' },
      ],
    };

    const { container } = render(
      <DesignRenderer
        design={design}
        properties={titleProperties}
        values={{ Title: 'The entry title' }}
      />,
    );

    expect(container.textContent).toBe('The entry title');
  });

  it('renders a wrapper per element', () => {
    const { container } = render(<DesignRenderer design={cardDesign_1} />);

    expect(container.querySelectorAll('.design-renderer-element')).toHaveLength(
      cardDesign_1.elements.length,
    );
  });

  it('sets the container to the given width', () => {
    const { container } = render(
      <DesignRenderer design={design_heading} width={480} />,
    );
    const renderer = container.querySelector('.design-renderer') as HTMLElement;

    expect(renderer.style.width).toBe('480px');
  });

  it('gives a growing band its block height as a minimum', () => {
    const { container } = render(<DesignRenderer design={design_heading} />);
    const heading = getElementWrapper(container, designElement_heading.id);

    expect(heading.style.minHeight).toBe(
      `${designElement_heading.rowSpan * Designs.constants.UnitPixelSize}px`,
    );
    expect(heading.style.height).toBe('');
    expect(heading.style.top).toBe('');
  });

  it('gives a fixed band its block height', () => {
    const { container } = render(<DesignRenderer design={design_stacked} />);
    const footer = getElementWrapper(container, designElement_stackedFooter.id);

    expect(footer.style.height).toBe(
      `${designElement_stackedFooter.rowSpan * Designs.constants.UnitPixelSize}px`,
    );
  });

  it('renders a gap as a spacer of its unit height', () => {
    const { container } = render(<DesignRenderer design={design_heading} />);
    const spacers = container.querySelectorAll<HTMLElement>(
      '.design-renderer-spacer',
    );

    // Two rows of gap above and below the heading
    expect(spacers).toHaveLength(2);
    expect(spacers[0].style.height).toBe(
      `${2 * Designs.constants.UnitPixelSize}px`,
    );
  });

  it('measures nothing for a design in flow', () => {
    render(<DesignRenderer design={design_stacked} />);

    expect(observers).toHaveLength(0);
  });

  it('positions the elements of an uncut band inside it', () => {
    const { container } = render(<DesignRenderer design={cardDesign_1} />);
    const atom = container.querySelector(
      '.design-renderer-atom',
    ) as HTMLElement;
    const icon = getElementWrapper(container, iconDesignElement.id);

    // The cover band holds the layered cover, title and icon at its
    // sixteen rows of unit height.
    expect(atom.style.minHeight).toBe(
      `${coverDesignElement.rowSpan * Designs.constants.UnitPixelSize}px`,
    );
    expect(atom.contains(icon)).toBe(true);
    expect(icon.style.top).toBe(
      `${iconDesignElement.row * Designs.constants.UnitPixelSize}px`,
    );
    expect(icon.style.width).toBe(
      `${iconDesignElement.columnSpan * Designs.constants.UnitPixelSize}px`,
    );
  });

  it('holds an element inside an uncut band at its unit height', () => {
    const { container } = render(<DesignRenderer design={cardDesign_1} />);
    const body = getElementWrapper(container, bodyDesignElement.id);

    // The growing body has gaps at its sides, so its band is uncut
    // and it takes its block height rather than a minimum.
    expect(body.style.height).toBe(
      `${bodyDesignElement.rowSpan * Designs.constants.UnitPixelSize}px`,
    );
    expect(body.style.minHeight).toBe('');
  });

  it('skips elements without a registered renderer', () => {
    // A design whose only element has no registered renderer
    const design: Design = {
      ...design_heading,
      elements: [{ ...designElement_heading, type: 'unknown' }],
    };
    const { container } = render(<DesignRenderer design={design} />);

    expect(container.querySelectorAll('.design-renderer-element')).toHaveLength(
      0,
    );
  });

  it('paints the elements of an uncut band in array order', () => {
    const { container } = render(<DesignRenderer design={cardDesign_1} />);
    const atom = container.querySelector(
      '.design-renderer-atom',
    ) as HTMLElement;
    const ids = Array.from(
      atom.querySelectorAll('.design-renderer-element'),
    ).map((node) => node.getAttribute('data-element-id'));

    expect(ids).toEqual([
      coverDesignElement.id,
      cardDesign_1.elements[1].id,
      iconDesignElement.id,
    ]);
  });

  it('sizes aspect-locked designs from the render width', () => {
    // A full-height fluid element in a 3/2 locked design
    const design: Design = {
      ...cardDesign_1,
      aspectRatio: '3/2',
      elements: [{ ...coverDesignElement, rowSpan: 32, heightMode: 'fluid' }],
    };
    const { container } = render(
      <DesignRenderer design={design} width={480} />,
    );
    const renderer = container.querySelector('.design-renderer') as HTMLElement;
    const cover = getElementWrapper(container, coverDesignElement.id);

    // 480px wide at 3/2 renders 320px tall, filled by the element
    expect(renderer.style.height).toBe('320px');
    expect(cover.style.top).toBe('0px');
    expect(cover.style.height).toBe('320px');
    expect(cover.style.width).toBe('480px');
  });

  it('measures the width of an aspect-locked design when none is given', () => {
    const design: Design = { ...cardDesign_1, aspectRatio: '3/2' };
    const { container } = render(<DesignRenderer design={design} />);
    const renderer = container.querySelector('.design-renderer') as HTMLElement;

    // No elements render until the width has been measured
    expect(container.querySelectorAll('.design-renderer-element')).toHaveLength(
      0,
    );

    // Report a measured container width
    reportMeasuredSize(renderer, 'offsetWidth', 480);

    const cover = getElementWrapper(container, coverDesignElement.id);

    expect(cover.style.width).toBe('480px');
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
    const bar = getElementWrapper(container, 'element_bar');

    // The bar keeps its unit height against the card's bottom edge
    expect(bar.style.height).toBe(`${6 * Designs.constants.UnitPixelSize}px`);
    expect(parseFloat(bar.style.top)).toBeCloseTo(
      320 - (32 - 26) * Designs.constants.UnitPixelSize,
    );
  });

  it('ignores the content fit in aspect-locked designs', () => {
    // The growing body element inside a locked design
    const design: Design = { ...cardDesign_1, aspectRatio: '3/2' };
    const { container } = render(
      <DesignRenderer design={design} width={480} />,
    );
    const body = getElementWrapper(container, bodyDesignElement.id);

    // The body gets an engine-resolved height instead of a minimum
    expect(body.style.minHeight).toBe('');
    expect(body.style.height).not.toBe('');
  });
});
