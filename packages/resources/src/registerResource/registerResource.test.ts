import { core } from '../test-utils';
import { ResourceApisStore } from '../ResourceApisStore';
import { createResource } from '../createResource';
import { registerResource } from './registerResource';

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

describe('registerResource', () => {
  it('registers the resource', () => {
    // Register a resource
    registerResource(core, resource);

    // Resource should be registered
    expect(ResourceApisStore.get('test')).toBeDefined();
  });

  it('adds the extension ID to the registered resource', () => {
    // Register a resource
    registerResource(core, resource);

    // Registered resource should contain the extension ID
    expect(ResourceApisStore.get('test').extension).toBe(core.extensionId);
  });

  it('dispatches a `resources:resource:register` event', (done) => {
    // Listen to 'resources:resource:register' events
    core.addEventListener('resources:resource:register', (payload) => {
      // Payload data should be the registered resource API
      expect(payload.data).toEqual({
        ...resource,
        extension: core.extensionId,
      });
      done();
    });

    // Register a resource
    registerResource(core, resource);
  });
});
