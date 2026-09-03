import { describe, expect, it } from 'vitest';
import {
  cardColumns,
  coverDesignElement,
  designElements,
  iconDesignElement,
  titleDesignElement,
} from '../../test-utils';
import { DesignElement } from '../../types';
import { remapElementColumns } from './remapElementColumns';

describe('remapElementColumns', () => {
  it('returns the elements unchanged for an equal column count', () => {
    expect(remapElementColumns(designElements, cardColumns, cardColumns)).toBe(
      designElements,
    );
  });

  it('scales a full-width fluid element to the new count', () => {
    const [remapped] = remapElementColumns(
      [coverDesignElement],
      cardColumns,
      24,
    );

    expect(remapped.column).toBe(0);
    expect(remapped.columnSpan).toBe(24);
  });

  it('keeps edge offsets fixed while the fluid span scales', () => {
    // A fluid element with 2-unit offsets on both edges
    const element: DesignElement = { ...titleDesignElement, columnSpan: 44 };
    const [remapped] = remapElementColumns([element], cardColumns, 24);

    expect(remapped.column).toBe(2);
    expect(remapped.columnSpan).toBe(20);
  });

  it('keeps fixed element widths and gaps fixed', () => {
    const remapped = remapElementColumns(
      [titleDesignElement, iconDesignElement],
      cardColumns,
      36,
    );
    const remappedIcon = remapped[1];

    // The icon keeps its width, and the gaps around it keep theirs, so
    // only the fluid title's span shrinks.
    expect(remappedIcon.columnSpan).toBe(iconDesignElement.columnSpan);
    expect(remappedIcon.column).toBe(iconDesignElement.column - 12);
  });

  it('preserves fluid span ratios on whole units', () => {
    // Two side-by-side fluid elements with a 2:1 span ratio
    const wideElement: DesignElement = {
      ...titleDesignElement,
      column: 0,
      columnSpan: 32,
    };
    const narrowElement: DesignElement = {
      ...titleDesignElement,
      id: 'element_narrow',
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
    const element: DesignElement = {
      ...coverDesignElement,
      widthMode: 'fixed-left',
    };
    const [remapped] = remapElementColumns([element], cardColumns, 24);

    expect(remapped.column).toBe(0);
    expect(remapped.columnSpan).toBe(24);
  });

  it('preserves extra element fields', () => {
    const [remapped] = remapElementColumns(
      [{ ...coverDesignElement, label: 'Cover' }],
      cardColumns,
      24,
    );

    expect(remapped.label).toBe('Cover');
  });
});
