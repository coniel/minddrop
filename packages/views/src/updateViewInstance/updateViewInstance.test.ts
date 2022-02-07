import { MockDate } from '@minddrop/test-utils';
import { ViewInstanceNotFoundError } from '../errors';
import { getViewInstance } from '../getViewInstance';
import { cleanup, core, setup, viewInstance } from '../tests';
import { UpdateViewInstanceData, ViewInstance } from '../types';
import { updateViewInstance } from './updateViewInstance';

interface Data extends UpdateViewInstanceData {
  foo: string;
}

type Instance = Data & ViewInstance;

describe('updateViewInstance', () => {
  beforeEach(() => {
    MockDate.set('01/01/2000');
    setup();
  });

  afterEach(() => {
    MockDate.reset();
    cleanup();
  });

  it('returns the updated view instance', () => {
    const updated = updateViewInstance<Data, Instance>(core, viewInstance.id, {
      foo: 'foo',
    });

    expect(updated.foo).toEqual('foo');
  });

  it('updates the view instance in the store', () => {
    const updated = updateViewInstance<Data, Instance>(core, viewInstance.id, {
      foo: 'foo',
    });

    const storeInstance = getViewInstance(updated.id);

    expect(updated).toEqual(storeInstance);
  });

  it('throws a ViewInstanceNotFoundError if the view instance does not exist', () => {
    expect(() => updateViewInstance(core, 'missing', {})).toThrowError(
      ViewInstanceNotFoundError,
    );
  });

  it('dispatches a `views:update-instance` event', (done) => {
    MockDate.set('01/02/2000');
    let updated: Instance;
    const callback = (payload) => {
      expect(payload.data.after).toEqual({ ...updated, updatedAt: new Date() });
      expect(payload.data.before).toEqual(viewInstance);
      expect(payload.data.changes).toEqual({
        foo: 'foo',
        updatedAt: new Date(),
      });
      done();
    };

    core.addEventListener('views:update-instance', callback);

    updated = updateViewInstance<Data, Instance>(core, viewInstance.id, {
      foo: 'foo',
    });
  });
});
