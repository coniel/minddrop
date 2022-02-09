import { cleanup, setup, viewInstance1, viewInstance2 } from '../tests';
import { getViewInstances } from './getViewInstances';

describe('getInstances', () => {
  beforeAll(() => {
    setup();
  });

  afterAll(() => {
    cleanup();
  });

  it('returns a view instance map of the view instances', () => {
    expect(
      getViewInstances([viewInstance1.id, viewInstance2.id, 'missing']),
    ).toEqual({
      [viewInstance1.id]: viewInstance1,
      [viewInstance2.id]: viewInstance2,
      missing: null,
    });
  });
});
