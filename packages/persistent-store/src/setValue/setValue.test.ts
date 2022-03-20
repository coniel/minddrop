import { initializeCore } from '@minddrop/core';
import { cleanup } from '../test-utils';
import { FieldValue } from '@minddrop/utils';
import { getStoreValue } from '../getStoreValue';
import { setStore } from '../setStore';
import { usePersistentStore } from '../usePersistentStore';
import { setValue } from './setValue';

const core = initializeCore({ appId: 'app', extensionId: 'test' });

describe('setValue', () => {
  afterEach(cleanup);

  it('sets a value in an existing store', () => {
    // Set the global store
    setStore('global', core, { foo: 'bar' });
    // Set a new value on the global store
    setValue('global', core, 'bar', 'foo');

    // New value should be set
    expect(getStoreValue('global', core, 'bar')).toBe('foo');
  });

  it('sets a value in a non-existing store', () => {
    // Set a new value on the global store
    setValue('global', core, 'bar', 'foo');

    // New value should be set
    expect(getStoreValue('global', core, 'bar')).toBe('foo');
  });

  it('supports FieldValues', () => {
    // Set a FieldValue on the global store
    setValue('global', core, 'foo', FieldValue.arrayUnion('foo'));

    // Should apply the FieldValue mutation to the field
    expect(getStoreValue('global', core, 'foo')).toEqual(['foo']);
  });

  it("dispatches a 'persistent-store:update-global' event", (done) => {
    // The original global store
    const before = usePersistentStore.getState().global;
    // The value to set
    const value = FieldValue.arrayUnion('foo');

    // Listen to 'persistent-store:update-global' events
    core.addEventListener('persistent-store:update-global', (payload) => {
      // The updated store value
      const after = usePersistentStore.getState().global;

      // Payload data should be an update object
      expect(payload.data.before).toEqual(before);
      expect(payload.data.after).toEqual(after);
      done();
    });

    // Set the value
    setValue('global', core, 'foo', value);
  });

  it("dispatches a 'persistent-store:update-local' event", (done) => {
    // The original local store
    const before = usePersistentStore.getState().local;
    // The value to set
    const value = FieldValue.arrayUnion('foo');

    // Listen to 'persistent-store:update-local' events
    core.addEventListener('persistent-store:update-local', (payload) => {
      // The updated store value
      const after = usePersistentStore.getState().local;

      // Payload data should be an update object
      expect(payload.data.before).toEqual(before);
      expect(payload.data.after).toEqual(after);
      done();
    });

    // Set the value
    setValue('local', core, 'foo', value);
  });
});
