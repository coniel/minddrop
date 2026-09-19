import React from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DropEventData } from '@minddrop/drag-and-drop';
import {
  DragSource,
  cleanup,
  dragAndDrop,
  dragOver,
  setup,
} from '@minddrop/drag-and-drop/test-utils';
import { createDomRect, render, screen } from '@minddrop/test-utils';
import { FlexDropContainer } from './FlexDropContainer';

/**
 * Renders a draggable item with an accepted data type.
 */
const Draggable: React.FC = () => (
  <DragSource
    id="item-1"
    type="item"
    data={{ items: ['item-1'] }}
    testId="item"
  />
);

describe('<FlexDropContainer />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('leaves the children flush against the edges when packed', () => {
    const { container } = render(
      <FlexDropContainer id="container" justify="start">
        <div>first</div>
        <div>second</div>
      </FlexDropContainer>,
    );

    // No gap takes the free space, so the children keep it
    expect(growingGaps(container)).toEqual([]);
  });

  it('gives the space between spread children to the gaps between them', () => {
    const { container } = render(
      <FlexDropContainer id="container" justify="space-between">
        <div>first</div>
        <div>second</div>
      </FlexDropContainer>,
    );

    // Gap zones are flex items, so the space between the children
    // has to be taken by the gap between them rather than left to
    // the container's distribution, which would spread the edge
    // gaps too.
    expect(growingGaps(container)).toEqual([1]);
  });

  it('gives the space around centred children to the edge gaps', () => {
    const { container } = render(
      <FlexDropContainer id="container" justify="center">
        <div>first</div>
        <div>second</div>
      </FlexDropContainer>,
    );

    expect(growingGaps(container)).toEqual([0, 2]);
  });

  it('gives the space before children at the end to the leading gap', () => {
    const { container } = render(
      <FlexDropContainer id="container" justify="end">
        <div>first</div>
        <div>second</div>
      </FlexDropContainer>,
    );

    expect(growingGaps(container)).toEqual([0]);
  });

  describe('drops', () => {
    // The drops taken, as the container's ID and gap index
    let drops: [string, number][] = [];

    beforeEach(() => {
      drops = [];
    });

    /**
     * Renders the container with two children and a draggable item.
     *
     * @param accepts - The data types the container accepts.
     * @returns The render result.
     */
    function renderContainer(accepts?: string[]) {
      const result = render(
        <>
          <Draggable />
          <FlexDropContainer
            id="container"
            data-testid="container"
            accepts={accepts}
            onDrop={(_: DropEventData, containerId: string, index: number) =>
              drops.push([containerId, index])
            }
          >
            <div data-testid="first">first</div>
            <div data-testid="second">second</div>
          </FlexDropContainer>
        </>,
      );

      // Lay the children out one above the other
      screen.getByTestId('first').getBoundingClientRect = () =>
        createDomRect(0, 0, 100, 40);
      screen.getByTestId('second').getBoundingClientRect = () =>
        createDomRect(0, 60, 100, 40);

      return result;
    }

    it('takes a drop on a gap at the gap position', () => {
      renderContainer();

      dragAndDrop(screen.getByTestId('item'), gap(1));

      expect(drops).toEqual([['container', 1]]);
    });

    it('takes a drop on its empty space at the nearest edge', () => {
      renderContainer();

      dragAndDrop(screen.getByTestId('item'), screen.getByTestId('container'), {
        clientY: 90,
      });

      expect(drops).toEqual([['container', 2]]);
    });

    it('marks the nearest edge gap while dragged over its empty space', () => {
      renderContainer();

      dragOver(screen.getByTestId('item'), screen.getByTestId('container'), {
        clientY: 10,
      });

      expect(gap(0).querySelector('.flex-drop-gap-line')).not.toBeNull();
    });

    it('leaves drags over its gaps to them', () => {
      renderContainer();

      dragOver(screen.getByTestId('item'), gap(1));

      // Only the gap dragged over marks the drop, not the edge gap
      // the container would mark for a drag over its empty space.
      expect(gap(1).querySelector('.flex-drop-gap-line')).not.toBeNull();
      expect(gap(0).querySelector('.flex-drop-gap-line')).toBeNull();
      expect(gap(2).querySelector('.flex-drop-gap-line')).toBeNull();
    });

    it('ignores a drag with none of the accepted types', () => {
      renderContainer(['other']);

      dragAndDrop(screen.getByTestId('item'), gap(1));

      expect(drops).toEqual([]);
    });
  });
});

/**
 * Returns the positions of the gaps taking a share of the
 * container's free space.
 *
 * @param container - The container element.
 * @returns The gap positions.
 */
function growingGaps(container: HTMLElement): number[] {
  return Array.from(container.querySelectorAll('[data-gap-zone]'))
    .filter((gap) => (gap as HTMLElement).style.flexGrow === '1')
    .map((gap) => Number(gap.getAttribute('data-position')));
}

/**
 * Returns the gap at the given position.
 *
 * @param index - The gap position.
 * @returns The gap element.
 */
function gap(index: number): HTMLElement {
  const element = document.querySelector(
    `[data-gap-zone][data-position="${index}"]`,
  );

  if (!element) {
    throw new Error(`No gap at position ${index}`);
  }

  return element as HTMLElement;
}
