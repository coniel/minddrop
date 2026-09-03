import { describe, expect, it } from 'vitest';
import {
  blockElements,
  cardColumns,
  coverElement,
  iconElement,
  titleElement,
} from '../../test-utils';
import { BlockElement } from '../../types';
import { remapElementColumns } from './remapElementColumns';

describe('remapElementColumns', () => {
  it('returns the elements unchanged for an equal column count', () => {
    expect(remapElementColumns(blockElements, cardColumns, cardColumns)).toBe(
      blockElements,
    );
  });

  it('scales a full-width fluid element to the new count', () => {
    const [remapped] = remapElementColumns([coverElement], cardColumns, 24);

    expect(remapped.column).toBe(0);
    expect(remapped.columnSpan).toBe(24);
  });

  it('keeps edge offsets fixed while the fluid span scales', () => {
    // A fluid element with 2-unit offsets on both edges
    const element: BlockElement = { ...titleElement, columnSpan: 44 };
    const [remapped] = remapElementColumns([element], cardColumns, 24);

    expect(remapped.column).toBe(2);
    expect(remapped.columnSpan).toBe(20);
  });

  it('keeps fixed element widths and gaps fixed', () => {
    const remapped = remapElementColumns(
      [titleElement, iconElement],
      cardColumns,
      36,
    );
    const remappedIcon = remapped[1];

    // The icon keeps its width, and the gaps around it keep theirs, so
    // only the fluid title's span shrinks
    expect(remappedIcon.columnSpan).toBe(iconElement.columnSpan);
    expect(remappedIcon.column).toBe(iconElement.column - 12);
  });

  it('preserves fluid span ratios on whole units', () => {
    // Two side-by-side fluid elements with a 2:1 span ratio
    const wideElement: BlockElement = {
      ...titleElement,
      column: 0,
      columnSpan: 32,
    };
    const narrowElement: BlockElement = {
      ...titleElement,
      id: 'element-narrow',
      column: 32,
      columnSpan: 16,
    };
    const remapped = remapElementColumns(
      [wideElement, narrowElement],
      cardColumns,
      24,
    );

    expect(remapped[0].columnSpan).toBe(16);
    expect(remapped[1].column).toBe(16);
    expect(remapped[1].columnSpan).toBe(8);
  });

  it('clamps elements into the new bounds with nothing to scale', () => {
    // A fixed element covering every column leaves nothing to scale
    const element: BlockElement = {
      ...coverElement,
      widthMode: 'fixed-left',
    };
    const [remapped] = remapElementColumns([element], cardColumns, 24);

    expect(remapped.column).toBe(0);
    expect(remapped.columnSpan).toBe(24);
  });

  it('preserves extra element fields', () => {
    const [remapped] = remapElementColumns(
      [{ ...coverElement, label: 'Cover' }],
      cardColumns,
      24,
    );

    expect(remapped.label).toBe('Cover');
  });
});
