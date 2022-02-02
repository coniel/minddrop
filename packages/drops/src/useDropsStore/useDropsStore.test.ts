import { renderHook, act, MockDate } from '@minddrop/test-utils';
import { generateDrop } from '../generateDrop';
import { DropConfig } from '../types/DropConfig.types';
import { useDropsStore } from './useDropsStore';

const config: DropConfig = {
  type: 'text',
  name: 'Text',
  description: 'A text drop.',
  create: () =>
    new Promise((resolve) => resolve(generateDrop({ type: 'text' }))),
};

describe('useDropsStore', () => {
  afterEach(() => {
    MockDate.reset();
    const { result } = renderHook(() => useDropsStore((state) => state));
    act(() => {
      result.current.clearDrops();
      result.current.clearRegistered();
    });
  });

  it('registers new drop types', () => {
    const { result } = renderHook(() => useDropsStore((state) => state));

    act(() => {
      result.current.registerDropType(config);
    });

    expect(result.current.registered.length).toBe(1);
    expect(result.current.registered[0]).toEqual(config);
  });

  it('unregisters drop types', () => {
    const { result } = renderHook(() => useDropsStore((state) => state));

    act(() => {
      result.current.registerDropType(config);
      result.current.unregisterDropType(config.type);
    });

    expect(Object.keys(result.current.registered).length).toBe(0);
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

  it('clears drops from the store', () => {
    const { result } = renderHook(() => useDropsStore((state) => state));

    act(() => {
      result.current.loadDrops([
        generateDrop({ type: 'text' }),
        generateDrop({ type: 'text' }),
      ]);
      result.current.clearDrops();
    });

    expect(Object.keys(result.current.drops).length).toBe(0);
  });

  it('clears registered drop types from the store', () => {
    const { result } = renderHook(() => useDropsStore((state) => state));

    act(() => {
      result.current.registerDropType(config);
      result.current.clearRegistered();
    });

    expect(result.current.registered.length).toBe(0);
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
