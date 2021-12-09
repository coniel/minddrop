import { ResourceConnector } from '../types';
import { initializeCore } from './initializeCore';

describe('initializeCore', () => {
  it('manages event listeners', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    const callback3 = jest.fn();
    const data = { foo: 'foo' };
    const core = initializeCore('core');

    // Add event listeners
    core.addEventListener('test', callback1);
    core.addEventListener('test', callback2);
    core.addEventListener('test-2', callback3);

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

    expect(core.resourceConnectors.length).toBe(1);
    expect(core.resourceConnectors[0]).toBe(connector);
    expect(registerCallback).toHaveBeenCalled();
    expect(registerCallback.mock.calls[0][0].data).toEqual(connector);

    // Removes resource connectors and dispatches 'core:unregister-resource'
    core.addEventListener('core:unregister-resource', unregisterCallback);
    core.unregisterResource('test');

    expect(core.resourceConnectors.length).toBe(0);
    expect(unregisterCallback).toHaveBeenCalled();
    expect(unregisterCallback.mock.calls[0][0].data).toEqual(connector);

    // Ignores unregistering non-existant resources
    unregisterCallback.mockClear();
    core.unregisterResource('invalid');

    expect(unregisterCallback).not.toHaveBeenCalled();
  });
});
