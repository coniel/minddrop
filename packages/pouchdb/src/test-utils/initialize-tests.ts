import { initializeCore } from '@minddrop/core';
import { Resources, RDDataSchema } from '@minddrop/resources';

interface Data {
  foo?: string;
}

const dataSchema: RDDataSchema<Data> = {
  foo: {
    type: 'string',
    required: false,
  },
};

export const FooResource = Resources.create<Data>({
  resource: 'foos:foo',
  dataSchema,
});
export const BarResource = Resources.create<Data>({
  resource: 'bars:bar',
  dataSchema,
});

export const core = initializeCore({ appId: 'app', extensionId: 'app' });

export function setup() {
  // Register a couple of test resources
  Resources.register(core, FooResource);
  Resources.register(core, BarResource);
}

export function cleanup() {
  // Clear registered resources
  Resources.clear();
}
