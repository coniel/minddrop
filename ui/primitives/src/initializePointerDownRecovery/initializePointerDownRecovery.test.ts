import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { initializePointerDownRecovery } from './initializePointerDownRecovery';

describe('initializePointerDownRecovery', () => {
  let cleanup: VoidFunction;
  let target: HTMLButtonElement;
  let pointerDowns: PointerEvent[];

  beforeEach(() => {
    cleanup = initializePointerDownRecovery();
    target = document.createElement('button');
    pointerDowns = [];

    document.body.appendChild(target);
    target.addEventListener('pointerdown', (event) => {
      pointerDowns.push(event as PointerEvent);
    });
  });

  afterEach(() => {
    cleanup();
    target.remove();
  });

  it('dispatches the pointerdown a press arrived without', () => {
    pressWithoutPointerDown();

    expect(pointerDowns.length).toBe(1);
  });

  it('dispatches it on the pressed element', () => {
    pressWithoutPointerDown();

    expect(pointerDowns[0].target).toBe(target);
  });

  it('reports it as a primary mouse press', () => {
    pressWithoutPointerDown();

    expect(pointerDowns[0].pointerType).toBe('mouse');
    expect(pointerDowns[0].isPrimary).toBe(true);
  });

  it('gives it the position of the press', () => {
    pressWithoutPointerDown(30, 40);

    expect(pointerDowns[0].clientX).toBe(30);
    expect(pointerDowns[0].clientY).toBe(40);
  });

  it('leaves a press which brought its own pointerdown alone', () => {
    dispatchPointerDown();
    dispatchMouseDown();

    // Only the press's own pointerdown
    expect(pointerDowns.length).toBe(1);
  });

  it('dispatches nothing after cleanup', () => {
    cleanup();

    pressWithoutPointerDown();

    expect(pointerDowns.length).toBe(0);
  });

  /**
   * Presses the target the way WebKit delivers the first press
   * after a native drag: a mousedown with no pointerdown.
   */
  function pressWithoutPointerDown(clientX = 10, clientY = 10): void {
    dispatchMouseDown(clientX, clientY);
  }

  /**
   * Dispatches a pointerdown on the target.
   */
  function dispatchPointerDown(clientX = 10, clientY = 10): void {
    target.dispatchEvent(
      new PointerEvent('pointerdown', {
        bubbles: true,
        clientX,
        clientY,
        pointerType: 'mouse',
      }),
    );
  }

  /**
   * Dispatches a mousedown on the target.
   */
  function dispatchMouseDown(clientX = 10, clientY = 10): void {
    target.dispatchEvent(
      new MouseEvent('mousedown', { bubbles: true, clientX, clientY }),
    );
  }
});
