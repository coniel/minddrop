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

  it('adds a drop', () => {
    const { result } = renderHook(() => useDropsStore((state) => state));

    act(() => {
      result.current.addDrop(generateDrop({ type: 'text' }));
    });

    expect(Object.keys(result.current.drops).length).toBe(1);
  });

  it('updates a drop', () => {
    const drop = generateDrop({ type: 'text' });
    const { result } = renderHook(() => useDropsStore((state) => state));

    act(() => {
      result.current.addDrop(drop);
      result.current.updateDrop(drop.id, { color: 'red' });
    });

    expect(result.current.drops[drop.id].color).toBe('red');
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
