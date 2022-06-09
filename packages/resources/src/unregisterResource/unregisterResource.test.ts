import { core } from '../test-utils';
import { ResourceApisStore } from '../ResourceApisStore';
import { createResource } from '../createResource';
import { registerResource } from '../registerResource';
import { unregisterResource } from './unregisterResource';

interface Data {
  foo?: 'string';
}

const resource = createResource<Data, Data, Data>({
  resource: 'test',
  dataSchema: {
    foo: {
      type: 'string',
    },
  },
});

describe('unregisterResource', () => {
  beforeEach(() => {
    // Register a resource
    registerResource(core, resource);
  });

  it('unregisters the resource', () => {
    // Unregister a resource
    unregisterResource(core, resource);

    // Resource should no longer be registered
    expect(ResourceApisStore.get('test')).toBeUndefined();
  });

  it('dispatches a `resources:resource:unregister` event', (done) => {
    // Listen to 'resources:resource:unregister' events
    core.addEventListener('resources:resource:unregister', (payload) => {
      // Payload data should be the unregistered resource API
      expect(payload.data).toEqual({
        ...resource,
        extension: core.extensionId,
      });
      done();
    });

    // Unregister a resource
    unregisterResource(core, resource);
  });
});
