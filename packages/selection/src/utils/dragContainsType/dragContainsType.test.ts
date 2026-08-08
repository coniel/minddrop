import { describe, expect, it } from 'vitest';
import { toMimeType } from '../toMimeType';
import { dragContainsType } from './dragContainsType';

// Creates a minimal drag event containing the given transfer types
function createDragEvent(types: string[]): DragEvent {
  return { dataTransfer: { types } } as unknown as DragEvent;
}

describe('dragContainsType', () => {
  it('returns false if the event has no data transfer', () => {
    const event = { dataTransfer: null } as unknown as DragEvent;

    expect(dragContainsType(event, ['database-entries'])).toBe(false);
  });

  it('matches MindDrop data keys against their MIME type', () => {
    const event = createDragEvent([toMimeType('database-entries')]);

    expect(dragContainsType(event, ['database-entries'])).toBe(true);
  });

  it('matches MindDrop data keys serialized in plain form', () => {
    const event = createDragEvent([toMimeType('database-entries', false)]);

    expect(dragContainsType(event, ['database-entries'])).toBe(true);
  });

  it('matches raw MIME types as is', () => {
    const event = createDragEvent(['text/plain']);

    expect(dragContainsType(event, ['text/plain'])).toBe(true);
  });

  it('matches the special Files type as is', () => {
    const event = createDragEvent(['Files']);

    expect(dragContainsType(event, ['Files'])).toBe(true);
  });

  it('matches if any of the given types is present', () => {
    const event = createDragEvent([toMimeType('design-elements')]);

    expect(
      dragContainsType(event, ['database-entries', 'design-elements']),
    ).toBe(true);
  });

  it('returns false if none of the given types are present', () => {
    const event = createDragEvent([toMimeType('design-elements')]);

    expect(dragContainsType(event, ['database-entries'])).toBe(false);
  });
});
