import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DragAndDrop, DragEffect } from '@minddrop/drag-and-drop';
import {
  cleanup,
  dragOver,
  releaseDrag,
  setup,
} from '@minddrop/drag-and-drop/test-utils';
import { createDomRect, render, screen } from '@minddrop/test-utils';
import { initializeDragLayer } from './initializeDragLayer';

/**
 * A draggable item with some content to clone.
 */
const Draggable: React.FC<{ effect?: DragEffect }> = ({ effect }) => {
  const { draggableProps, isDragging } = DragAndDrop.useDraggable({
    id: 'item-1',
    type: 'item',
    data: { items: ['item-1'] },
    effect,
  });

  return (
    <div data-testid="item" data-dragging={isDragging} {...draggableProps}>
      <span id="content" contentEditable suppressContentEditableWarning>
        Item
      </span>
    </div>
  );
};

/**
 * A drop target taking any drag.
 */
const DropTarget: React.FC = () => {
  const { droppableProps } = DragAndDrop.useDroppable({
    type: 'zone',
    id: 'zone',
  });

  return <div data-testid="zone" {...droppableProps} />;
};

let removeLayer: VoidFunction;

describe('initializeDragLayer', () => {
  beforeEach(() => {
    setup();
    removeLayer = initializeDragLayer();
  });

  afterEach(() => {
    removeLayer();
    cleanup();
  });

  // Returns the preview in the layer, or null while there is none
  function preview(): HTMLElement | null {
    return document.querySelector('.drag-layer-preview');
  }

  // Returns where the last settle animation ends, as a translation
  function settledTranslation(): string {
    const calls = vi.mocked(HTMLElement.prototype.animate).mock.calls;
    const keyframes = calls[calls.length - 1][0] as Keyframe[];

    return keyframes[keyframes.length - 1].translate as string;
  }

  // Returns the preview in the layer
  function getPreview(): HTMLElement {
    const clone = preview();

    if (!clone) {
      throw new Error('The layer shows no preview');
    }

    return clone;
  }

  // The layer reacts to the drag's events. They reach it a moment
  // after the gesture.
  it('shows a clone of the dragged element while dragging', async () => {
    render(<Draggable />);

    dragOver(screen.getByTestId('item'), document.body);

    await vi.waitFor(() => expect(preview()).toHaveTextContent('Item'));
  });

  it('clones the element as it was before the drag marked it', async () => {
    render(<Draggable />);

    dragOver(screen.getByTestId('item'), document.body);

    // The source re-renders as dragging. That may hide or collapse
    // it. The clone shows it as it was picked up.
    await vi.waitFor(() =>
      expect(preview()).toHaveAttribute('data-dragging', 'false'),
    );
  });

  it('keeps the clone under the pointer where it was picked up', async () => {
    render(<Draggable />);

    // Lay the item out so the press lands at its centre
    screen.getByTestId('item').getBoundingClientRect = () =>
      createDomRect(0, 0, 100, 40);

    dragOver(screen.getByTestId('item'), document.body, {
      clientX: 50,
      clientY: 60,
    });

    // The move starting the drag picked the item up 10px past its
    // centre along both axes. The pointer sits at (60, 30) within it.
    // The clone follows 10px left and 30px down of its origin.
    await vi.waitFor(() =>
      expect(getPreview().style.translate).toBe('-10px 30px'),
    );
  });

  it('strips the clone of its identity and editing', async () => {
    render(<Draggable />);

    dragOver(screen.getByTestId('item'), document.body);

    await vi.waitFor(() => expect(preview()).not.toBeNull());

    const clone = getPreview();

    expect(clone.querySelector('[id]')).toBeNull();
    expect(clone.querySelector('[contenteditable]')).toBeNull();
    expect(clone.querySelector('[data-draggable-key]')).toBeNull();
    expect(clone).toHaveAttribute('inert');
  });

  it('marks the clone as a preview for the element to style itself by', async () => {
    render(<Draggable />);

    dragOver(screen.getByTestId('item'), document.body);

    await vi.waitFor(() =>
      expect(preview()).toHaveAttribute('data-drag-preview'),
    );
  });

  it('removes the clone once the drag ends', async () => {
    render(<Draggable />);

    dragOver(screen.getByTestId('item'), document.body);

    await vi.waitFor(() => expect(preview()).not.toBeNull());

    releaseDrag();

    await vi.waitFor(() => expect(preview()).toBeNull());
  });

  describe('settling', () => {
    beforeEach(() => {
      // Stub the animation the environment lacks, so that where the
      // preview settles can be read off its keyframes.
      HTMLElement.prototype.animate = vi.fn(() => ({}) as Animation);
    });

    it('settles a moved item onto where it is rendered', async () => {
      render(
        <>
          <Draggable />
          <DropTarget />
        </>,
      );

      dragOver(screen.getByTestId('item'), screen.getByTestId('zone'), {
        clientX: 200,
        clientY: 100,
      });

      await vi.waitFor(() => expect(preview()).not.toBeNull());

      releaseDrag({ clientX: 200, clientY: 100 });

      // The source is the only element rendering the item, so the
      // preview settles back onto it.
      await vi.waitFor(() => expect(settledTranslation()).toBe('0px 0px'));
    });

    it('fades a copied item out where it was dropped', async () => {
      render(
        <>
          <Draggable effect="copy" />
          <DropTarget />
        </>,
      );

      dragOver(screen.getByTestId('item'), screen.getByTestId('zone'), {
        clientX: 200,
        clientY: 100,
      });

      await vi.waitFor(() => expect(preview()).not.toBeNull());

      // Where the preview sits as it is dropped
      const dropped = getPreview().style.translate;

      releaseDrag({ clientX: 200, clientY: 100 });

      // The source keeps rendering the item as it was, so the preview
      // does not return to it.
      await vi.waitFor(() => expect(settledTranslation()).toBe(dropped));
    });
  });

  it('removes the layer when torn down', () => {
    removeLayer();

    expect(document.querySelector('.drag-layer')).toBeNull();

    // Make the cleanup's second teardown a no-op
    removeLayer = () => undefined;
  });
});
