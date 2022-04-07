import { renderHook, act } from '@minddrop/test-utils';
import { onDisable, onRun } from './drops-extension';
import { generateDrop } from '../generateDrop';
import { useAllDrops } from '../useAllDrops';
import { Drops } from '../Drops';
import { registerDropType } from '../registerDropType';
import { cleanup, core, setup, textDropConfig } from '../test-utils';
import { getRegisteredDropTypes } from '../getRegisteredDropTypes';

describe('drops extension', () => {
  beforeEach(setup);

  afterEach(cleanup);

  describe('onRun', () => {
    describe('drops resource registration', () => {
      it('loads drops', () => {
        const { result } = renderHook(() => useAllDrops());
        const drop = generateDrop({ type: 'text' });

        onRun(core);

        act(() => {
          const [connector] = core.getResourceConfigs();
          connector.onLoad([drop]);
        });

        expect(result.current[drop.id]).toBeDefined();
      });

      it('handles added/updated drops', () => {
        const { result } = renderHook(() => useAllDrops());
        const drop = generateDrop({ type: 'text' });

        onRun(core);

        act(() => {
          const [connector] = core.getResourceConfigs();
          connector.onChange(drop, false);
        });

        expect(result.current[drop.id]).toBeDefined();
      });

      it('handles deleted drops', () => {
        const { result } = renderHook(() => useAllDrops());
        const drop = generateDrop({ type: 'text' });

        onRun(core);

        act(() => {
          const [connector] = core.getResourceConfigs();
          connector.onLoad([drop]);
          connector.onChange(drop, true);
        });

        expect(result.current[drop.id]).not.toBeDefined();
      });
    });
  });

  describe('onDisable', () => {
    it('clears the store', () => {
      const { result } = renderHook(() => useAllDrops());
      const drop1 = generateDrop({ type: 'text' });
      const drop2 = generateDrop({ type: 'text' });

      onRun(core);

      act(() => {
        registerDropType(core, textDropConfig);
        Drops.load(core, [drop1, drop2]);
        onDisable(core);
      });

      expect(result.current[drop1.id]).not.toBeDefined();
      expect(result.current[drop2.id]).not.toBeDefined();
      expect(getRegisteredDropTypes().length).toBe(0);
    });

    it('removes event listeners', () => {
      onRun(core);
      Drops.addEventListener(core, 'drops:create', jest.fn());

      act(() => {
        onDisable(core);
        expect(core.hasEventListeners()).toBe(false);
      });
    });
  });
});
