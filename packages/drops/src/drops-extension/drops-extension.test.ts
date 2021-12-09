import { renderHook, act } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { onDisable, onRun } from './drops-extension';
import { generateDrop } from '../generateDrop';
import { useAllDrops } from '../useAllDrops';
import { Drops } from '../Drops';
import { Drop } from '../types';

let core = initializeCore('drops');

describe('drops extension', () => {
  describe('onRun', () => {
    afterEach(() => {
      act(() => {
        Drops.clear(core);
      });
      core = initializeCore('drops');
    });

    it("reacts to 'drops:load' events by loading the drops into the store", () => {
      const { result } = renderHook(() => useAllDrops());
      const drop1 = generateDrop({ type: 'text' });
      const drop2 = generateDrop({ type: 'text' });

      onRun(core);

      act(() => {
        Drops.load(core, [drop1, drop2]);
      });

      expect(result.current[drop1.id]).toBeDefined();
      expect(result.current[drop2.id]).toBeDefined();
    });

    it("reacts to 'drops:clear' events by clearing the drops store", () => {
      const { result } = renderHook(() => useAllDrops());
      const drop1 = generateDrop({ type: 'text' });
      const drop2 = generateDrop({ type: 'text' });

      onRun(core);

      act(() => {
        Drops.load(core, [drop1, drop2]);
        Drops.clear(core);
      });

      expect(result.current[drop1.id]).not.toBeDefined();
      expect(result.current[drop2.id]).not.toBeDefined();
    });

    it("reacts to 'drops:create' events by adding the new drop to the store", () => {
      const { result } = renderHook(() => useAllDrops());
      let drop: Drop;

      onRun(core);

      act(() => {
        drop = Drops.create(core, { type: 'text' });
      });

      expect(result.current[drop.id]).toBeDefined();
    });

    it("reacts to 'drops:update' events by updating the drop in the store", () => {
      const { result } = renderHook(() => useAllDrops());
      const drop = generateDrop({ type: 'text', markdown: 'Hello' });

      onRun(core);

      act(() => {
        Drops.load(core, [drop]);
        Drops.update(core, drop.id, { markdown: 'Updated' });
      });

      expect(result.current[drop.id].markdown).toBe('Updated');
    });

    it("reacts to 'drops:delete-permanently' events by removing the drop from the store", () => {
      const { result } = renderHook(() => useAllDrops());
      let drop: Drop;

      onRun(core);

      act(() => {
        drop = Drops.create(core, { type: 'text' });
        Drops.deletePermanently(core, drop.id);
      });

      expect(result.current[drop.id]).not.toBeDefined();
    });
  });

  describe('onDisable', () => {
    afterEach(() => {
      act(() => {
        Drops.clear(core);
      });
      core = initializeCore('drops');
    });

    it('clears the store', () => {
      const { result } = renderHook(() => useAllDrops());
      const drop1 = generateDrop({ type: 'text' });
      const drop2 = generateDrop({ type: 'text' });

      onRun(core);

      act(() => {
        Drops.load(core, [drop1, drop2]);
        onDisable(core);
      });

      expect(result.current[drop1.id]).not.toBeDefined();
      expect(result.current[drop2.id]).not.toBeDefined();
    });

    it('removes event listeners', () => {
      const { result } = renderHook(() => useAllDrops());
      const drop1 = generateDrop({ type: 'text' });
      const drop2 = generateDrop({ type: 'text' });

      onRun(core);

      act(() => {
        onDisable(core);
        Drops.load(core, [drop1, drop2]);
      });

      expect(result.current[drop1.id]).not.toBeDefined();
      expect(result.current[drop2.id]).not.toBeDefined();
    });
  });
});
