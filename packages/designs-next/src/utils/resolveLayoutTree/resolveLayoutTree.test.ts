import { describe, expect, it } from 'vitest';
import {
  DesignElementFixtures,
  DesignFixtures,
  captionSlotElement,
  slottedDesignElement,
} from '../../test-utils';
import { Design, DesignElement, LayoutBox } from '../../types';
import { resolveLayoutTree } from './resolveLayoutTree';

const {
  design_cover_title,
  design_heading,
  design_icons_beside_text,
  design_pinwheel,
  design_stacked,
} = DesignFixtures;
const {
  bodyDesignElement,
  coverDesignElement,
  designElement_heading,
  designElement_stackedBody,
  designElement_stackedFooter,
  designElement_stackedHeading,
  titleDesignElement,
} = DesignElementFixtures;

describe('resolveLayoutTree', () => {
  it('cuts the heading design into a heading band between two spacers', () => {
    const tree: LayoutBox = {
      type: 'rows',
      column: 0,
      row: 0,
      columnSpan: 48,
      rowSpan: 12,
      children: [
        { type: 'spacer', column: 0, row: 0, columnSpan: 48, rowSpan: 2 },
        {
          type: 'element',
          column: 0,
          row: 2,
          columnSpan: 48,
          rowSpan: 8,
          element: designElement_heading,
        },
        { type: 'spacer', column: 0, row: 10, columnSpan: 48, rowSpan: 2 },
      ],
    };

    expect(resolveLayoutTree(design_heading)).toEqual(tree);
  });

  it('cuts the stacked design into element bands and a spacer', () => {
    const tree: LayoutBox = {
      type: 'rows',
      column: 0,
      row: 0,
      columnSpan: 48,
      rowSpan: 32,
      children: [
        {
          type: 'element',
          column: 0,
          row: 0,
          columnSpan: 48,
          rowSpan: 8,
          element: designElement_stackedHeading,
        },
        {
          type: 'element',
          column: 0,
          row: 8,
          columnSpan: 48,
          rowSpan: 16,
          element: designElement_stackedBody,
        },
        { type: 'spacer', column: 0, row: 24, columnSpan: 48, rowSpan: 4 },
        {
          type: 'element',
          column: 0,
          row: 28,
          columnSpan: 48,
          rowSpan: 4,
          element: designElement_stackedFooter,
        },
      ],
    };

    expect(resolveLayoutTree(design_stacked)).toEqual(tree);
  });

  it('cuts a gapless design between its flush elements', () => {
    // The stacked heading and body, which touch, with nothing else
    const design: Design = {
      ...design_stacked,
      rows: 24,
      elements: [designElement_stackedHeading, designElement_stackedBody],
    };
    const tree = resolveLayoutTree(design);

    expect(tree.type).toBe('rows');
    expect(
      tree.type === 'rows' && tree.children.map((box) => box.type),
    ).toEqual(['element', 'element']);
  });

  it('keeps layered elements in one atomic band', () => {
    const tree = resolveLayoutTree(design_cover_title);

    expect(tree.type === 'rows' && tree.children[0]).toEqual({
      type: 'atom',
      column: 0,
      row: 0,
      columnSpan: 48,
      rowSpan: 16,
      elements: [coverDesignElement, titleDesignElement],
    });
    // The body has gaps at its sides, so its band is not cut yet
    expect(tree.type === 'rows' && tree.children[2]).toEqual({
      type: 'atom',
      column: 0,
      row: 20,
      columnSpan: 48,
      rowSpan: 10,
      elements: [bodyDesignElement],
    });
  });

  it('compiles a design with no free horizontal line to one atom', () => {
    // The text beside the icons spans every row
    expect(resolveLayoutTree(design_icons_beside_text)).toEqual({
      type: 'atom',
      column: 0,
      row: 0,
      columnSpan: 48,
      rowSpan: 22,
      elements: design_icons_beside_text.elements,
    });
  });

  it('compiles the pinwheel to one atom', () => {
    expect(resolveLayoutTree(design_pinwheel)).toEqual({
      type: 'atom',
      column: 0,
      row: 0,
      columnSpan: 48,
      rowSpan: 32,
      elements: design_pinwheel.elements,
    });
  });

  it('compiles an empty design to one spacer', () => {
    expect(resolveLayoutTree({ ...design_heading, elements: [] })).toEqual({
      type: 'spacer',
      column: 0,
      row: 0,
      columnSpan: 48,
      rowSpan: 12,
    });
  });

  it('leaves an element held by another to its parent', () => {
    // A full-width slotted body holding the caption in its slot
    const body: DesignElement = {
      ...slottedDesignElement,
      column: 0,
      columnSpan: 48,
    };
    const design: Design = {
      ...design_heading,
      rows: 32,
      elements: [body, captionSlotElement],
    };
    const tree = resolveLayoutTree(design);

    // The body is a band of its own, the caption appears nowhere
    expect(tree.type === 'rows' && tree.children[1]).toEqual({
      type: 'element',
      column: 0,
      row: body.row,
      columnSpan: 48,
      rowSpan: body.rowSpan,
      element: body,
    });
  });
});
