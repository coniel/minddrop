import { describe, expect, it } from 'vitest';
import { DesignElementFixtures, DesignFixtures } from '../../test-utils';
import { Design, DesignElement, LayoutBox } from '../../types';
import { resolveLayoutTree } from './resolveLayoutTree';

const {
  design_coverTitle,
  design_heading,
  design_iconsBesideText,
  design_pinwheel,
  design_stacked,
} = DesignFixtures;
const {
  bodyDesignElement,
  captionSlotElement,
  coverDesignElement,
  designElement_besideIcon_1,
  designElement_besideIcon_2,
  designElement_besideIcon_3,
  designElement_besideText,
  designElement_bottomBar,
  designElement_fluidCover,
  designElement_heading,
  designElement_stackedBody,
  designElement_stackedFooter,
  designElement_stackedHeading,
  iconDesignElement,
  slottedDesignElement,
  titleDesignElement,
} = DesignElementFixtures;

// The column units of a full-width band under a fluid element
const fluidWidth = { fixed: 0, scaling: 48 };

// A box type, or a box type followed by the types of its children
type TypeTree = string | [string, ...TypeTree[]];

/**
 * Reduces a box tree to its types, nested as the boxes are.
 *
 * @param box - The box.
 * @returns The box's type, followed by its children's when it has any.
 */
function resolveTypeTree(box: LayoutBox): TypeTree {
  if (box.type === 'rows' || box.type === 'columns') {
    return [box.type, ...box.children.map(resolveTypeTree)];
  }

  return box.type;
}

describe('resolveLayoutTree', () => {
  it('cuts the heading design into a heading band between two spacers', () => {
    // The heading is pinned to the top, so the gap below it scales
    const tree: LayoutBox = {
      type: 'rows',
      column: 0,
      row: 0,
      columnSpan: 48,
      rowSpan: 12,
      columnUnits: fluidWidth,
      rowUnits: { fixed: 10, scaling: 2 },
      children: [
        {
          type: 'spacer',
          column: 0,
          row: 0,
          columnSpan: 48,
          rowSpan: 2,
          columnUnits: fluidWidth,
          rowUnits: { fixed: 2, scaling: 0 },
        },
        {
          type: 'element',
          column: 0,
          row: 2,
          columnSpan: 48,
          rowSpan: 8,
          columnUnits: fluidWidth,
          rowUnits: { fixed: 8, scaling: 0 },
          element: designElement_heading,
        },
        {
          type: 'spacer',
          column: 0,
          row: 10,
          columnSpan: 48,
          rowSpan: 2,
          columnUnits: fluidWidth,
          rowUnits: { fixed: 0, scaling: 2 },
        },
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
      columnUnits: fluidWidth,
      rowUnits: { fixed: 32, scaling: 0 },
      children: [
        {
          type: 'element',
          column: 0,
          row: 0,
          columnSpan: 48,
          rowSpan: 8,
          columnUnits: fluidWidth,
          rowUnits: { fixed: 8, scaling: 0 },
          element: designElement_stackedHeading,
        },
        {
          type: 'element',
          column: 0,
          row: 8,
          columnSpan: 48,
          rowSpan: 16,
          columnUnits: fluidWidth,
          rowUnits: { fixed: 16, scaling: 0 },
          element: designElement_stackedBody,
        },
        {
          type: 'spacer',
          column: 0,
          row: 24,
          columnSpan: 48,
          rowSpan: 4,
          columnUnits: fluidWidth,
          rowUnits: { fixed: 4, scaling: 0 },
        },
        {
          type: 'element',
          column: 0,
          row: 28,
          columnSpan: 48,
          rowSpan: 4,
          columnUnits: fluidWidth,
          rowUnits: { fixed: 4, scaling: 0 },
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
    const tree = resolveLayoutTree(design_coverTitle);

    expect(tree.type === 'rows' && tree.children[0]).toEqual({
      type: 'atom',
      column: 0,
      row: 0,
      columnSpan: 48,
      rowSpan: 16,
      columnUnits: fluidWidth,
      rowUnits: { fixed: 16, scaling: 0 },
      elements: [coverDesignElement, titleDesignElement],
    });
  });

  it('boxes overlapping elements at their union rectangle', () => {
    // A half-width cover with a title over it, beside a text that
    // starts lower than the cover and ends below it.
    const cover: DesignElement = { ...coverDesignElement, columnSpan: 24 };
    const title: DesignElement = { ...titleDesignElement, columnSpan: 18 };
    const text: DesignElement = {
      ...designElement_besideText,
      column: 26,
      columnSpan: 22,
      row: 4,
      rowSpan: 16,
    };
    const design: Design = {
      ...design_coverTitle,
      rows: 20,
      elements: [cover, title, text],
    };
    const tree = resolveLayoutTree(design);
    const cluster =
      tree.type === 'columns' &&
      tree.children[0].type === 'rows' &&
      tree.children[0].children[0];

    // The cover and title share a box the size of the cover, with
    // the rows below it as a spacer of their own.
    expect(cluster).toEqual({
      type: 'atom',
      column: 0,
      row: 0,
      columnSpan: 24,
      rowSpan: 16,
      columnUnits: { fixed: 0, scaling: 24 },
      rowUnits: { fixed: 16, scaling: 0 },
      elements: [cover, title],
    });
  });

  it('cuts a band into column boxes around an element with side gaps', () => {
    const tree = resolveLayoutTree(design_coverTitle);
    const bandRows = { fixed: 10, scaling: 0 };

    // The body's band: a fixed gap, the fluid body, a fixed gap
    expect(tree.type === 'rows' && tree.children[2]).toEqual({
      type: 'columns',
      column: 0,
      row: 20,
      columnSpan: 48,
      rowSpan: 10,
      columnUnits: fluidWidth,
      rowUnits: bandRows,
      children: [
        {
          type: 'spacer',
          column: 0,
          row: 20,
          columnSpan: 2,
          rowSpan: 10,
          columnUnits: { fixed: 2, scaling: 0 },
          rowUnits: bandRows,
        },
        {
          type: 'element',
          column: 2,
          row: 20,
          columnSpan: 44,
          rowSpan: 10,
          columnUnits: { fixed: 0, scaling: 44 },
          rowUnits: bandRows,
          element: bodyDesignElement,
        },
        {
          type: 'spacer',
          column: 46,
          row: 20,
          columnSpan: 2,
          rowSpan: 10,
          columnUnits: { fixed: 2, scaling: 0 },
          rowUnits: bandRows,
        },
      ],
    });
  });

  it('cuts a design with no free horizontal line into column boxes', () => {
    // The icon column keeps its unit width, the gap beside it too,
    // and the text absorbs the width. The icon column cuts into its
    // icons and the gaps between them.
    const iconColumnUnits = { fixed: 6, scaling: 0 };
    const fullHeight = { fixed: 22, scaling: 0 };

    expect(resolveLayoutTree(design_iconsBesideText)).toEqual({
      type: 'columns',
      column: 0,
      row: 0,
      columnSpan: 48,
      rowSpan: 22,
      columnUnits: { fixed: 8, scaling: 40 },
      rowUnits: fullHeight,
      children: [
        {
          type: 'rows',
          column: 0,
          row: 0,
          columnSpan: 6,
          rowSpan: 22,
          columnUnits: iconColumnUnits,
          rowUnits: fullHeight,
          children: [
            {
              type: 'element',
              column: 0,
              row: 0,
              columnSpan: 6,
              rowSpan: 6,
              columnUnits: iconColumnUnits,
              rowUnits: { fixed: 6, scaling: 0 },
              element: designElement_besideIcon_1,
            },
            {
              type: 'spacer',
              column: 0,
              row: 6,
              columnSpan: 6,
              rowSpan: 2,
              columnUnits: iconColumnUnits,
              rowUnits: { fixed: 2, scaling: 0 },
            },
            {
              type: 'element',
              column: 0,
              row: 8,
              columnSpan: 6,
              rowSpan: 6,
              columnUnits: iconColumnUnits,
              rowUnits: { fixed: 6, scaling: 0 },
              element: designElement_besideIcon_2,
            },
            {
              type: 'spacer',
              column: 0,
              row: 14,
              columnSpan: 6,
              rowSpan: 2,
              columnUnits: iconColumnUnits,
              rowUnits: { fixed: 2, scaling: 0 },
            },
            {
              type: 'element',
              column: 0,
              row: 16,
              columnSpan: 6,
              rowSpan: 6,
              columnUnits: iconColumnUnits,
              rowUnits: { fixed: 6, scaling: 0 },
              element: designElement_besideIcon_3,
            },
          ],
        },
        {
          type: 'spacer',
          column: 6,
          row: 0,
          columnSpan: 2,
          rowSpan: 22,
          columnUnits: { fixed: 2, scaling: 0 },
          rowUnits: fullHeight,
        },
        {
          type: 'element',
          column: 8,
          row: 0,
          columnSpan: 40,
          rowSpan: 22,
          columnUnits: { fixed: 0, scaling: 40 },
          rowUnits: fullHeight,
          element: designElement_besideText,
        },
      ],
    });
  });

  it('compiles a right-pinned element to a scaling spacer on its left', () => {
    // The right-pinned icon alone in a band of its rows
    const design: Design = {
      ...design_heading,
      rows: iconDesignElement.rowSpan,
      elements: [{ ...iconDesignElement, row: 0 }],
    };
    const tree = resolveLayoutTree(design);

    expect(
      tree.type === 'columns' &&
        tree.children.map((box) => [box.type, box.columnUnits]),
    ).toEqual([
      ['spacer', { fixed: 0, scaling: 40 }],
      ['element', { fixed: 6, scaling: 0 }],
      ['spacer', { fixed: 2, scaling: 0 }],
    ]);
  });

  it('scales the bands of a fluid-height element and holds the pinned ones', () => {
    // A fluid-height cover above a bottom-pinned bar, as an
    // aspect-locked card would hold them.
    const design: Design = {
      ...design_coverTitle,
      aspectRatio: '3/2',
      elements: [designElement_fluidCover, designElement_bottomBar],
    };
    const tree = resolveLayoutTree(design);

    // The cover's rows scale, the gap and the bar keep their height
    expect(
      tree.type === 'rows' &&
        tree.children.map((box) => [box.type, box.rowUnits]),
    ).toEqual([
      ['element', { fixed: 0, scaling: 16 }],
      ['spacer', { fixed: 10, scaling: 0 }],
      ['element', { fixed: 6, scaling: 0 }],
    ]);
  });

  it('cuts column boxes into bands and those into column boxes again', () => {
    // A heading above a band of an icon column beside a text. The
    // first icon has gaps at its sides, the second fills the column.
    const icon_1: DesignElement = {
      ...designElement_besideIcon_1,
      column: 2,
      columnSpan: 4,
      row: 6,
      rowSpan: 4,
    };
    const icon_2: DesignElement = {
      ...designElement_besideIcon_2,
      column: 0,
      columnSpan: 8,
      row: 14,
      rowSpan: 8,
    };
    const text: DesignElement = {
      ...designElement_besideText,
      column: 10,
      columnSpan: 38,
      row: 6,
      rowSpan: 16,
    };
    const design: Design = {
      ...design_iconsBesideText,
      elements: [
        { ...designElement_stackedHeading, rowSpan: 4 },
        icon_1,
        icon_2,
        text,
      ],
    };

    expect(resolveTypeTree(resolveLayoutTree(design))).toEqual([
      'rows',
      'element',
      'spacer',
      [
        'columns',
        [
          'rows',
          ['columns', 'spacer', 'element', 'spacer'],
          'spacer',
          'element',
        ],
        'spacer',
        'element',
      ],
    ]);
  });

  it('terminates on an element with gaps on every side', () => {
    const design: Design = {
      ...design_heading,
      elements: [{ ...designElement_heading, column: 2, columnSpan: 44 }],
    };

    expect(resolveTypeTree(resolveLayoutTree(design))).toEqual([
      'rows',
      'spacer',
      ['columns', 'spacer', 'element', 'spacer'],
      'spacer',
    ]);
  });

  it('compiles the pinwheel to one atom', () => {
    expect(resolveLayoutTree(design_pinwheel)).toEqual({
      type: 'atom',
      column: 0,
      row: 0,
      columnSpan: 48,
      rowSpan: 32,
      columnUnits: fluidWidth,
      rowUnits: { fixed: 32, scaling: 0 },
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
      columnUnits: { fixed: 48, scaling: 0 },
      rowUnits: { fixed: 12, scaling: 0 },
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
      columnUnits: fluidWidth,
      rowUnits: { fixed: body.rowSpan, scaling: 0 },
      element: body,
    });
  });
});
