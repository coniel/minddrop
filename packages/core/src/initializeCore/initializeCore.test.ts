import { initializeCore } from './initializeCore';

describe('initializeCore', () => {
  it('manages event listeners', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    const callback3 = jest.fn();
    const data = { foo: 'foo' };
    const core = initializeCore('app');

    // Add event listeners
    core.addEventListener('test', callback1);
    core.addEventListener('test', callback2);
    core.addEventListener('test-2', callback3);

    // Dispatch 'test' event
    core.dispatch('test', data);

    expect(callback1).toHaveBeenCalledWith({
      data,
      source: 'app',
      type: 'test',
    });
    expect(callback2).toHaveBeenCalled();
    expect(callback3).not.toHaveBeenCalled();
    callback1.mockClear();
    callback2.mockClear();

    // Remove a single 'test' event listener
    core.removeEventListener('test', callback2);

    // Dispatch 'test' event
    core.dispatch('test', data);

    expect(callback1).toHaveBeenCalled();
    expect(callback2).not.toHaveBeenCalled();
    callback1.mockClear();

    core.removeAllEventListeners();

    // Dispatch 'test' event
    core.dispatch('test', data);
    // Dispatch 'test-2' event
    core.dispatch('test-2', data);

    expect(callback1).not.toHaveBeenCalled();
    expect(callback3).not.toHaveBeenCalled();
  });
});
