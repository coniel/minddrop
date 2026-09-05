import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { useDeleteKey } from './useDeleteKey';

// Dispatches a keydown for the key on the target, returning the
// event so its default can be inspected
function pressKey(key: string, target: EventTarget = document.body) {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
  });

  target.dispatchEvent(event);

  return event;
}

describe('useDeleteKey', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('calls back on Delete and Backspace, preventing their default', () => {
    let presses = 0;

    renderHook(() =>
      useDeleteKey(() => {
        presses += 1;
      }),
    );

    const deletePress = pressKey('Delete');
    const backspacePress = pressKey('Backspace');

    expect(presses).toBe(2);
    expect(deletePress.defaultPrevented).toBe(true);
    expect(backspacePress.defaultPrevented).toBe(true);
  });

  it('ignores other keys', () => {
    let presses = 0;

    renderHook(() =>
      useDeleteKey(() => {
        presses += 1;
      }),
    );

    pressKey('Enter');

    expect(presses).toBe(0);
  });

  it('leaves presses inside editable controls alone', () => {
    let presses = 0;

    renderHook(() =>
      useDeleteKey(() => {
        presses += 1;
      }),
    );

    const input = document.createElement('input');

    document.body.appendChild(input);

    const press = pressKey('Backspace', input);

    expect(presses).toBe(0);
    expect(press.defaultPrevented).toBe(false);
  });

  it('does not listen while disabled', () => {
    let presses = 0;

    renderHook(() =>
      useDeleteKey(() => {
        presses += 1;
      }, false),
    );

    pressKey('Delete');

    expect(presses).toBe(0);
  });

  it('calls the latest callback', () => {
    const calls: string[] = [];

    const { rerender } = renderHook(
      ({ label }: { label: string }) =>
        useDeleteKey(() => {
          calls.push(label);
        }),
      { initialProps: { label: 'first' } },
    );

    rerender({ label: 'second' });
    pressKey('Delete');

    expect(calls).toEqual(['second']);
  });
});
