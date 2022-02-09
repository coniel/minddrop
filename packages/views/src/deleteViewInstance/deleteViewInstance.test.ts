import { cleanup } from '@minddrop/test-utils';
import { ViewInstance } from '../types';
import { ViewInstanceNotFoundError } from '../errors';
import { getViewInstance } from '../getViewInstance';
import { core, setup, viewInstance1 } from '../tests';
import { deleteViewInstance } from './deleteViewInstance';

describe('deleteViewInstance', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('deletes the view instance', () => {
    deleteViewInstance(core, viewInstance1.id);

    expect(() => getViewInstance(viewInstance1.id)).toThrowError(
      ViewInstanceNotFoundError,
    );
  });

  it('returns the deleted view instance', () => {
    const deleted = deleteViewInstance(core, viewInstance1.id);

    expect(deleted).toEqual(viewInstance1);
  });

  it('dispatches a `views:delete-instance` event', (done) => {
    let deleted: ViewInstance;
    const callback = (payload) => {
      expect(payload.data).toEqual(deleted);
      done();
    };

    core.addEventListener('views:delete-instance', callback);

    deleted = deleteViewInstance(core, viewInstance1.id);
  });

  it('throws a ViewInstanceNotFoundError if the view instance does not exist', () => {
    expect(() => deleteViewInstance(core, 'missing')).toThrowError(
      ViewInstanceNotFoundError,
    );
  });
});
