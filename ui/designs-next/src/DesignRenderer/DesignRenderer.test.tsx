import { afterEach, describe, expect, it } from 'vitest';
import {
  Design,
  DesignElement,
  DesignElementConfigs,
  Designs,
} from '@minddrop/designs-next';
import {
  DesignElementFixtures,
  DesignFixtures,
} from '@minddrop/designs-next/test-utils';
import { PropertiesSchema, PropertyValue } from '@minddrop/properties';
import { fireEvent, render, screen } from '@minddrop/test-utils';
import { StandInElementFixtures, cleanup } from '../test-utils';
import { DesignRenderer } from './DesignRenderer';

const {
  cardDesign_1,
  design_heading,
  design_iconsBesideText,
  design_pinwheel,
  design_stacked,
} = DesignFixtures;
const {
  bodyDesignElement,
  coverDesignElement,
  designElement_besideIcon_1,
  designElement_besideText,
  designElement_bottomBar,
  designElement_fluidCover,
  designElement_heading,
  designElement_pinwheel_3,
  designElement_pinwheel_5,
  designElement_stackedFooter,
  iconDesignElement,
  titleDesignElement,
} = DesignElementFixtures;

const { elementConfig_value, elementConfig_edit } = StandInElementFixtures;

const titleProperties: PropertiesSchema = [{ type: 'title', name: 'Title' }];

// A design whose only element writes 'Edited' to the Title property
const editDesign: Design = {
  ...design_heading,
  elements: [
    {
      ...designElement_heading,
      type: elementConfig_edit.type,
      property: 'Title',
      content: 'Edited',
    },
  ],
};

// A 3/2 locked card of the fluid cover above the bottom bar
const lockedDesign: Design = {
  ...cardDesign_1,
  aspectRatio: '3/2',
  elements: [designElement_fluidCover, designElement_bottomBar],
};

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
  afterEach(cleanup);

  it('renders a mapped element from the property values', () => {
    DesignElementConfigs.register(elementConfig_value);

    const design: Design = {
      ...design_heading,
      elements: [
        {
          ...designElement_heading,
          type: elementConfig_value.type,
          property: 'Title',
        },
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

  it("hands an element's value change to the callback", () => {
    DesignElementConfigs.register(elementConfig_edit);

    // The change the renderer is handed
    let change: [string, PropertyValue] | null = null;

    render(
      <DesignRenderer
        design={editDesign}
        properties={titleProperties}
        values={{ Title: 'The entry title' }}
        onValueChange={(name, value) => {
          change = [name, value];
        }}
      />,
    );

    fireEvent.click(screen.getByText('edit'));

    expect(change).toEqual(['Title', 'Edited']);
  });

  it("validates an element's value through the callback", () => {
    DesignElementConfigs.register(elementConfig_edit);

    render(
      <DesignRenderer
        design={editDesign}
        properties={titleProperties}
        values={{ Title: 'The entry title' }}
        onValueChange={() => {}}
        validateValue={(name, value) => `${name} rejects ${value}`}
      />,
    );

    expect(screen.getByText('Title rejects Edited')).toBeInTheDocument();
  });

  it('renders a wrapper per element', () => {
    const { container } = render(<DesignRenderer design={cardDesign_1} />);

    expect(container.querySelectorAll('.design-renderer-element')).toHaveLength(
      cardDesign_1.elements.length,
    );
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
      `${designElement_heading.row * Designs.constants.UnitPixelSize}px`,
    );
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
    expect(icon.style.top).toBe(
      `${iconDesignElement.row * Designs.constants.UnitPixelSize}px`,
    );
    expect(icon.style.width).toBe(
      `${iconDesignElement.columnSpan * Designs.constants.UnitPixelSize}px`,
    );
  });

  it('holds an element inside an uncut region at its unit height', () => {
    // The pinwheel's centre element set to grow
    const centre: DesignElement = {
      ...designElement_pinwheel_5,
      contentFit: 'grow',
    };
    const design: Design = {
      ...design_pinwheel,
      elements: [...design_pinwheel.elements.slice(0, 4), centre],
    };
    const { container } = render(<DesignRenderer design={design} />);
    const wrapper = getElementWrapper(container, centre.id);

    // No line cuts the pinwheel, so the element takes its block
    // height rather than a minimum.
    expect(wrapper.style.height).toBe(
      `${centre.rowSpan * Designs.constants.UnitPixelSize}px`,
    );
    expect(wrapper.style.minHeight).toBe('');
  });

  it('holds a pinned element against the edge of its uncut region', () => {
    // The pinwheel's bottom-right element pinned to the bottom
    const bottom: DesignElement = {
      ...designElement_pinwheel_3,
      heightMode: 'fixed-bottom',
    };
    const design: Design = {
      ...design_pinwheel,
      elements: [
        ...design_pinwheel.elements.slice(0, 2),
        bottom,
        ...design_pinwheel.elements.slice(3),
      ],
    };
    const { container } = render(<DesignRenderer design={design} />);
    const wrapper = getElementWrapper(container, bottom.id);

    // The two empty rows above the element take any height the
    // region gains, so the element keeps its distance from the
    // bottom edge. Twenty rows above them and thirty in all keep
    // their unit height.
    expect(wrapper.style.top).toBe(
      `calc(${20 * Designs.constants.UnitPixelSize}px + 100% - ${30 * Designs.constants.UnitPixelSize}px)`,
    );
    expect(wrapper.style.height).toBe(
      `${bottom.rowSpan * Designs.constants.UnitPixelSize}px`,
    );
  });

  it('lays a band with no free horizontal line out as column boxes', () => {
    const { container } = render(
      <DesignRenderer design={design_iconsBesideText} />,
    );
    const columns = container.querySelector(
      '.design-renderer-columns',
    ) as HTMLElement;
    const text = getElementWrapper(container, designElement_besideText.id);
    const spacer = columns.querySelector(
      ':scope > .design-renderer-spacer',
    ) as HTMLElement;
    const icons = columns.querySelector(
      ':scope > .design-renderer-rows',
    ) as HTMLElement;

    // The text grows by its forty columns, the gap and the icon
    // column keep their unit width.
    expect(text.style.flexGrow).toBe(`${designElement_besideText.columnSpan}`);
    expect(text.style.flexBasis).toBe('0px');
    expect(spacer.style.flexBasis).toBe(
      `${(designElement_besideText.column - designElement_besideIcon_1.columnSpan) * Designs.constants.UnitPixelSize}px`,
    );
    expect(icons.style.flexBasis).toBe(
      `${designElement_besideIcon_1.columnSpan * Designs.constants.UnitPixelSize}px`,
    );
  });

  it('renders a column of stacked elements as bands of the column', () => {
    const { container } = render(
      <DesignRenderer design={design_iconsBesideText} />,
    );
    const icon = getElementWrapper(container, designElement_besideIcon_1.id);

    // Every element is in flow, the icons as bands at their block
    // height.
    expect(container.querySelector('.design-renderer-atom')).toBeNull();
    expect(icon.style.height).toBe(
      `${designElement_besideIcon_1.rowSpan * Designs.constants.UnitPixelSize}px`,
    );
  });

  it('grows an element between its side gaps', () => {
    const { container } = render(<DesignRenderer design={cardDesign_1} />);
    const body = getElementWrapper(container, bodyDesignElement.id);

    // The body's band is cut into gap, body, gap, so the body grows
    expect(body.style.minHeight).toBe(
      `${bodyDesignElement.rowSpan * Designs.constants.UnitPixelSize}px`,
    );
    expect(body.style.flexGrow).toBe(`${bodyDesignElement.columnSpan}`);
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
      titleDesignElement.id,
      iconDesignElement.id,
    ]);
  });

  it('holds an aspect-locked design at its ratio', () => {
    const { container } = render(<DesignRenderer design={lockedDesign} />);
    const renderer = container.querySelector('.design-renderer') as HTMLElement;

    expect(renderer.style.aspectRatio).toBe('3 / 2');
  });

  it('caps a design at its content width, padded at the sides', () => {
    // A narrow page with 24px of side padding
    const design: Design = {
      ...DesignFixtures.pageDesign_1,
      columns: 120,
      contentWidth: 'narrow',
      sidePadding: 24,
    };
    const { container } = render(<DesignRenderer design={design} />);
    const renderer = container.querySelector('.design-renderer') as HTMLElement;

    expect(renderer.style.maxWidth).toBe('528px');
    expect(renderer.style.paddingLeft).toBe('24px');
  });

  it('scales a fluid-height band with the locked height', () => {
    const { container } = render(<DesignRenderer design={lockedDesign} />);
    const cover = getElementWrapper(container, designElement_fluidCover.id);

    // The cover grows by its rows from no basis of its own
    expect(cover.style.flexGrow).toBe(`${designElement_fluidCover.rowSpan}`);
    expect(cover.style.flexBasis).toBe('0px');
    expect(cover.style.minHeight).toBe('0');
  });

  it('pins fixed-height bands in aspect-locked designs', () => {
    const { container } = render(<DesignRenderer design={lockedDesign} />);
    const bar = getElementWrapper(container, designElement_bottomBar.id);
    const gap = container.querySelector(
      '.design-renderer-spacer',
    ) as HTMLElement;

    // The bar and the gap above it keep their unit height, so the
    // bar holds its distance from the bottom edge.
    expect(bar.style.flexGrow).toBe('0');
    expect(bar.style.flexBasis).toBe(
      `${designElement_bottomBar.rowSpan * Designs.constants.UnitPixelSize}px`,
    );
    expect(gap.style.flexGrow).toBe('0');
    expect(gap.style.flexBasis).toBe(
      `${(designElement_bottomBar.row - designElement_fluidCover.rowSpan) * Designs.constants.UnitPixelSize}px`,
    );
  });

  it('ignores the content fit in aspect-locked designs', () => {
    // The growing body element inside a locked design
    const design: Design = { ...cardDesign_1, aspectRatio: '3/2' };
    const { container } = render(<DesignRenderer design={design} />);
    const body = getElementWrapper(container, bodyDesignElement.id);
    const band = body.closest('.design-renderer-columns') as HTMLElement;

    // The body stretches to its band, which holds its ten rows
    expect(body.style.minHeight).toBe('');
    expect(body.style.height).toBe('');
    expect(band.style.flexBasis).toBe(
      `${bodyDesignElement.rowSpan * Designs.constants.UnitPixelSize}px`,
    );
  });
});
