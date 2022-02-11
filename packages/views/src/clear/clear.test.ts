import { act, renderHook } from '@minddrop/test-utils';
import { cleanup, core, setup } from '../test-utils';
import { useViewsStore } from '../useViewsStore';
import { clear } from './clear';

describe('clear', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('clears views and view instances from the store', () => {
    const { result } = renderHook(() => useViewsStore());

    act(() => {
      clear(core);
    });

    expect(result.current.views).toEqual({});
    expect(result.current.instances).toEqual({});
  });

  it('dispatches a `views:clear` event', (done) => {
    const callback = () => done();

    core.addEventListener('views:clear', callback);

    act(() => {
      clear(core);
    });
  });
});
