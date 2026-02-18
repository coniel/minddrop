import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, serialzedSelection, setup } from '../../test-utils';
import { serializeSelection } from './serializeSelection';

describe('serializeSelection', () => {
  beforeEach(() =>
    setup({ loadSelection: true, loadSelectionItemSerializers: true }),
  );

  afterEach(cleanup);

  it('serializes the selection items by type', () => {
    const serialized = serializeSelection();

    expect(serialized).toEqual(serialzedSelection);
  });
});
