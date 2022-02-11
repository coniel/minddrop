import { getViewInstances } from '../getViewInstances/getViewInstances';
import {
  cleanup,
  core,
  setup,
  viewInstance1,
  viewInstance2,
} from '../test-utils';
import { loadViewInstances } from './loadViewInstances';

const loaded1 = { ...viewInstance1, id: 'loaded-1' };
const loaded2 = { ...viewInstance1, id: 'loaded-2' };

describe('loadViewInstances', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('loads view instances into the store', () => {
    loadViewInstances(core, [loaded1, loaded2]);

    const instances = getViewInstances([
      viewInstance1.id,
      viewInstance2.id,
      loaded1.id,
      loaded2.id,
    ]);

    expect(instances).toEqual({
      [loaded1.id]: loaded1,
      [loaded2.id]: loaded2,
      [viewInstance1.id]: viewInstance1,
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
