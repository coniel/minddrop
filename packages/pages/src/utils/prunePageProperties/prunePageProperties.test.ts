import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { boundPageLayout, cleanup, setup } from '../../test-utils';
import { prunePageProperties } from './prunePageProperties';

describe('prunePageProperties', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('keeps values for properties bound in the layout', () => {
    expect(prunePageProperties(boundPageLayout.id, { title: 'Media' })).toEqual(
      { title: 'Media' },
    );
  });

  it('drops values for properties not bound in the layout', () => {
    expect(
      prunePageProperties(boundPageLayout.id, { title: 'Media', rating: 5 }),
    ).toEqual({ title: 'Media' });
  });

  it('leaves properties untouched when the layout cannot be resolved', () => {
    expect(
      prunePageProperties('layout_missing', { title: 'Media', rating: 5 }),
    ).toEqual({ title: 'Media', rating: 5 });
  });
});
