import { renderHook, act, MockDate } from '@minddrop/test-utils';
import { generateDrop } from '../generateDrop';
import { useDropsStore } from './useDropsStore';

describe('useDropsStore', () => {
  afterEach(() => {
    MockDate.reset();
    const { result } = renderHook(() => useDropsStore((state) => state));
    act(() => {
      result.current.clear();
    });
  });

  it('loads in drops', () => {
    const { result } = renderHook(() => useDropsStore((state) => state));

    act(() => {
      result.current.loadDrops([
        generateDrop({ type: 'text' }),
        generateDrop({ type: 'text' }),
      ]);
    });

    expect(Object.keys(result.current.drops).length).toBe(2);
  });

  it('clears the store', () => {
    const { result } = renderHook(() => useDropsStore((state) => state));

    act(() => {
      result.current.loadDrops([
        generateDrop({ type: 'text' }),
        generateDrop({ type: 'text' }),
      ]);
      result.current.clear();
    });

    expect(Object.keys(result.current.drops).length).toBe(0);
  });

  it('sets a drop', () => {
    const { result } = renderHook(() => useDropsStore((state) => state));

    act(() => {
      result.current.setDrop(generateDrop({ type: 'text' }));
    });

    expect(Object.keys(result.current.drops).length).toBe(1);
  });

  it('removes a drop', () => {
    const drop = generateDrop({ type: 'text' });
    const { result } = renderHook(() => useDropsStore((state) => state));

    act(() => {
      result.current.loadDrops([drop, generateDrop({ type: 'text' })]);
      result.current.removeDrop(drop.id);
    });

    expect(Object.keys(result.current.drops).length).toBe(1);
  });
});
