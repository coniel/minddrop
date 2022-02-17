import { renderHook, act, MockDate } from '@minddrop/test-utils';
import { generateDrop } from '../generateDrop';
import { useDropsStore } from './useDropsStore';
import { registeredTextDropConfig, textDropConfig } from '../test-utils';

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
      result.current.registerDropType(registeredTextDropConfig);
    });

    expect(result.current.registered.length).toBe(1);
    expect(result.current.registered[0]).toEqual(registeredTextDropConfig);
  });

  it('unregisters drop types', () => {
    const { result } = renderHook(() => useDropsStore((state) => state));

    act(() => {
      result.current.registerDropType(registeredTextDropConfig);
      result.current.unregisterDropType(textDropConfig.type);
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
      result.current.registerDropType(registeredTextDropConfig);
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
