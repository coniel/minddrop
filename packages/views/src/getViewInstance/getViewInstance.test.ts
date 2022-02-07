import { ViewInstanceNotFoundError } from '../errors';
import { cleanup, setup, viewInstance } from '../tests';
import { getViewInstance } from './getViewInstance';

describe('getInstance', () => {
  beforeAll(() => {
    setup();
  });

  afterAll(() => {
    cleanup();
  });

  it('returns the view instance', () => {
    expect(getViewInstance(viewInstance.id)).toEqual(viewInstance);
  });

  it('throws a ViewInstanceNotFoundError if the view instance does not exist', () => {
    expect(() => getViewInstance('missing')).toThrowError(
      ViewInstanceNotFoundError,
    );
  });
});
