import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createDataTransfer } from '@minddrop/test-utils';
import {
  cleanup,
  mimeType_A,
  mimeType_B,
  serialzedSelection,
  setup,
} from '../../test-utils';
import { serializeSelectionToDataTransfer } from './serializeSelectionToDataTransfer';

describe('serializeSelectionToDataTransfer', () => {
  beforeEach(() => setup({ loadSelection: true }));

  afterEach(cleanup);

  it('adds the selection data to the data transfer', () => {
    const dataTransfer = createDataTransfer({});

    serializeSelectionToDataTransfer(dataTransfer);

    expect(dataTransfer.getData(mimeType_A)).toEqual(
      serialzedSelection[mimeType_A],
    );
    expect(dataTransfer.getData(mimeType_B)).toEqual(
      serialzedSelection[mimeType_B],
    );
    expect(dataTransfer.getData('text/plain')).toEqual(
      serialzedSelection['text/plain'],
    );
    expect(dataTransfer.getData('text/html')).toEqual(
      serialzedSelection['text/html'],
    );
  });
});
