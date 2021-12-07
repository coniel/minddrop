import { renderHook, act, MockDate } from '@minddrop/test-utils';
import { generateDrop } from '../generateDrop';
import { createDropStore } from './createDropStore';

const useDropStore = createDropStore();

describe('useDropStore', () => {
  afterEach(() => {
    MockDate.reset();
    const { result } = renderHook(() => useDropStore((state) => state));
    act(() => {
      result.current.clear();
    });
  });

  it('loads in drops', () => {
    const { result } = renderHook(() => useDropStore((state) => state));

    act(() => {
      result.current.loadDrops([generateDrop('text'), generateDrop('text')]);
    });

    expect(Object.keys(result.current.drops).length).toBe(2);
  });

  it('clears the store', () => {
    const { result } = renderHook(() => useDropStore((state) => state));

    act(() => {
      result.current.loadDrops([generateDrop('text'), generateDrop('text')]);
      result.current.clear();
    });

    expect(Object.keys(result.current.drops).length).toBe(0);
  });

  it('adds a drop', () => {
    const { result } = renderHook(() => useDropStore((state) => state));

    act(() => {
      result.current.addDrop(generateDrop('text'));
    });

    expect(Object.keys(result.current.drops).length).toBe(1);
  });

  it('updates a drop', () => {
    const drop = generateDrop('text');
    const { result } = renderHook(() => useDropStore((state) => state));

    act(() => {
      result.current.addDrop(drop);
      result.current.updateDrop(drop.id, { color: 'red' });
    });

    expect(result.current.drops[drop.id].color).toBe('red');
  });

  it('removes a drop', () => {
    const drop = generateDrop('text');
    const { result } = renderHook(() => useDropStore((state) => state));

    act(() => {
      result.current.loadDrops([drop, generateDrop('text')]);
      result.current.removeDrop(drop.id);
    });

    expect(Object.keys(result.current.drops).length).toBe(1);
  });
});
