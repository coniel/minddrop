import { describe, expect, it } from 'vitest';
import { toMimeType } from '@minddrop/selection';
import { DesignLayoutTypesDataKey } from '../../constants';
import { readLayoutTypeDragData } from './readLayoutTypeDragData';

describe('readLayoutTypeDragData', () => {
  it('reads the dragged layout type', () => {
    const event = dragEventWithData(
      toMimeType(DesignLayoutTypesDataKey),
      JSON.stringify([{ layoutType: 'card' }]),
    );

    expect(readLayoutTypeDragData(event)).toEqual({ layoutType: 'card' });
  });

  it('returns null when the drop carries no layout type', () => {
    const event = dragEventWithData(
      toMimeType('design-element-templates'),
      JSON.stringify([{ type: 'text' }]),
    );

    expect(readLayoutTypeDragData(event)).toBeNull();
  });

  it('returns null when the payload is empty', () => {
    const event = dragEventWithData(
      toMimeType(DesignLayoutTypesDataKey),
      JSON.stringify([]),
    );

    expect(readLayoutTypeDragData(event)).toBeNull();
  });
});

/**
 * Builds a drop event carrying a single data transfer entry.
 */
function dragEventWithData(type: string, value: string): React.DragEvent {
  return {
    dataTransfer: {
      getData: (requestedType: string) => (requestedType === type ? value : ''),
    },
  } as React.DragEvent;
}
