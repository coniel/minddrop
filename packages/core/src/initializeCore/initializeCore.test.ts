import { ResourceConnector } from '../types';
import { initializeCore } from './initializeCore';

describe('initializeCore', () => {
  it('manages event listeners', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    const callback3 = jest.fn();
    const data = { foo: 'foo' };
    const core = initializeCore('core');
    const core2 = initializeCore('core-2');

    // Add event listeners
    core.addEventListener('test', callback1);
    core.addEventListener('test', callback2);
    core.addEventListener('test-2', callback3);

    // Check that event listener exists
    expect(core.eventListenerCount('test')).toBe(2);
    expect(core.hasEventListener('test', callback1)).toBe(true);
    expect(core.hasEventListeners('test')).toBe(true);

    // Dispatch 'test' event
    core.dispatch('test', data);

    expect(callback1).toHaveBeenCalledWith({
      data,
      source: 'core',
      type: 'test',
    });
    expect(callback2).toHaveBeenCalled();
    expect(callback3).not.toHaveBeenCalled();
    callback1.mockClear();
    callback2.mockClear();

    // Remove a single 'test' event listener
    core.removeEventListener('test', callback2);

    // Check that event listener was removed
    expect(core.hasEventListener('test', callback2)).toBe(false);

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

    // Add event listeners
    callback1.mockClear();
    callback2.mockClear();
    callback3.mockClear();
    core.addEventListener('test', callback1);
    core.addEventListener('test', callback2);
    core2.addEventListener('test', callback3);

    // Remove all 'test' event listeners for core-1
    core.removeEventListeners('test');

    // Dispatch 'test' event
    core.dispatch('test', data);

    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).not.toHaveBeenCalled();
    expect(callback3).toHaveBeenCalled();
  });

  it('manages resource connectors', () => {
    const core = initializeCore('core');
    const registerCallback = jest.fn();
    const unregisterCallback = jest.fn();
    const connector: ResourceConnector = {
      type: 'test',
    };

    // Adds resource connectors and dispatches 'core:register-resource'
    core.addEventListener('core:register-resource', registerCallback);
    core.registerResource(connector);

    expect(core.isResourceRegistered('test')).toBe(true);
    expect(core.getResourceConnectors().length).toBe(1);
    expect(core.getResourceConnectors()[0]).toBe(connector);
    expect(registerCallback).toHaveBeenCalled();
    expect(registerCallback.mock.calls[0][0].data).toEqual(connector);

    // Removes resource connectors and dispatches 'core:unregister-resource'
    core.addEventListener('core:unregister-resource', unregisterCallback);
    core.unregisterResource('test');

    expect(core.getResourceConnectors().length).toBe(0);
    expect(unregisterCallback).toHaveBeenCalled();
    expect(unregisterCallback.mock.calls[0][0].data).toEqual(connector);

    // Ignores unregistering non-existant resources
    unregisterCallback.mockClear();
    core.unregisterResource('invalid');

    expect(unregisterCallback).not.toHaveBeenCalled();
  });
});
