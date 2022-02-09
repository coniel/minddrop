import { renderHook } from '@minddrop/test-utils';
import { cleanup, setup, viewInstance1 } from '../tests';
import { useViewInstance } from './useViewInstance';

describe('useViewInstance', () => {
  beforeAll(() => {
    setup();
  });

  afterAll(() => {
    cleanup();
  });

  it('returns the view instance', () => {
    const { result } = renderHook(() => useViewInstance(viewInstance1.id));

    expect(result.current).toEqual(viewInstance1);
  });

  it('returns null if the view instance does not exist', () => {
    const { result } = renderHook(() => useViewInstance('fake-id'));

    expect(result.current).toBeNull();
  });
});
