import { getViewInstances } from '../getViewInstances/getViewInstances';
import { cleanup, core, setup, viewInstance, viewInstance2 } from '../tests';
import { loadViewInstances } from './loadViewInstances';

const loaded1 = { ...viewInstance, id: 'loaded-1' };
const loaded2 = { ...viewInstance, id: 'loaded-2' };

describe('loadViewInstances', () => {
  beforeEach(() => {
    setup();
  });

  afterEach(() => {
    cleanup();
  });

  it('loads view instances into the store', () => {
    loadViewInstances(core, [loaded1, loaded2]);

    const instances = getViewInstances([
      viewInstance.id,
      viewInstance2.id,
      loaded1.id,
      loaded2.id,
    ]);

    expect(instances).toEqual({
      [loaded1.id]: loaded1,
      [loaded2.id]: loaded2,
      [viewInstance.id]: viewInstance,
      [viewInstance2.id]: viewInstance2,
    });
  });

  it('dispatches a `views:load-instances` event', (done) => {
    const callback = (payload) => {
      expect(payload.data).toEqual([loaded1, loaded2]);
      done();
    };

    core.addEventListener('views:load-instances', callback);

    loadViewInstances(core, [loaded1, loaded2]);
  });
});
