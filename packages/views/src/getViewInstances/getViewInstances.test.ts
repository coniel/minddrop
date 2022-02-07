import { cleanup, setup, viewInstance, viewInstance2 } from '../tests';
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
      getViewInstances([viewInstance.id, viewInstance2.id, 'missing']),
    ).toEqual({
      [viewInstance.id]: viewInstance,
      [viewInstance2.id]: viewInstance2,
      missing: null,
    });
  });
});
