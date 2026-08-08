import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { setDragPreview } from './setDragPreview';

describe('setDragPreview', () => {
  let element: HTMLDivElement;
  let dragImage: { element: Element; offsetX: number; offsetY: number } | null =
    null;

  // Creates a minimal drag event which records the set drag image
  function createDragEvent(): DragEvent {
    return {
      clientX: 10,
      clientY: 20,
      dataTransfer: {
        setDragImage: (image: Element, offsetX: number, offsetY: number) => {
          dragImage = { element: image, offsetX, offsetY };
        },
      },
    } as unknown as DragEvent;
  }

  beforeEach(() => {
    // Add a source element to the document
    element = document.createElement('div');
    element.className = 'drag-source';
    document.body.appendChild(element);
  });

  afterEach(() => {
    // Reset the document and recorded drag image
    document.body.innerHTML = '';
    dragImage = null;
  });

  it('sets a clone of the element as the drag image', () => {
    setDragPreview(createDragEvent(), element);

    // The drag image should be a clone, not the element itself
    expect(dragImage).not.toBeNull();
    expect(dragImage!.element).not.toBe(element);
    expect(dragImage!.element.className).toBe('drag-source');
  });

  it('renders the clone in the document', () => {
    setDragPreview(createDragEvent(), element);

    // The clone should be attached to the document body
    expect(dragImage!.element.parentElement).toBe(document.body);
  });

  it('offsets the drag image by the cursor position within the element', () => {
    setDragPreview(createDragEvent(), element);

    // jsdom rects are zero sized at the origin, so the offsets
    // equal the event's client coordinates
    expect(dragImage!.offsetX).toBe(10);
    expect(dragImage!.offsetY).toBe(20);
  });

  it('removes the clone once the browser has captured it', async () => {
    setDragPreview(createDragEvent(), element);

    // Wait for the removal animation frame
    await new Promise(requestAnimationFrame);

    expect(dragImage!.element.parentElement).toBeNull();
  });

  it('does nothing if the event has no data transfer object', () => {
    const event = { dataTransfer: null } as unknown as DragEvent;

    setDragPreview(event, element);

    // No clone should have been added to the document
    expect(document.body.children.length).toBe(1);
  });
});
