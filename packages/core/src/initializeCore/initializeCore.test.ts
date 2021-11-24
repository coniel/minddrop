import { initializeCore } from './initializeCore';

describe('initializeCore', () => {
  it('manages event listeners', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    const callback3 = jest.fn();
    const data = { foo: 'foo' };
    const core = initializeCore();

    // Add event listeners
    core.addEventListener('core', 'test', callback1);
    core.addEventListener('core', 'test', callback2);
    core.addEventListener('core', 'test-2', callback3);

    // Dispatch 'test' event
    core.dispatch('core', 'test', data);

    expect(callback1).toHaveBeenCalledWith({
      data,
      source: 'core',
      type: 'test',
    });
    expect(callback2).toHaveBeenCalled();
    expect(callback3).not.toHaveBeenCalled();
    callback1.mockClear();
    callback2.mockClear();

    // Remove 1 'test' event listener
    core.removeEventListener('core', 'test', callback2);

    // Dispatch 'test' event
    core.dispatch('core', 'test', data);

    expect(callback1).toHaveBeenCalled();
    expect(callback2).not.toHaveBeenCalled();
  });
});
