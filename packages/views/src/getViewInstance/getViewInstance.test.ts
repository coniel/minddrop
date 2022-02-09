import { ViewInstanceNotFoundError } from '../errors';
import { cleanup, setup, viewInstance1 } from '../tests';
import { getViewInstance } from './getViewInstance';

describe('getInstance', () => {
  beforeAll(() => {
    setup();
  });

  afterAll(() => {
    cleanup();
  });

  it('returns the view instance', () => {
    expect(getViewInstance(viewInstance1.id)).toEqual(viewInstance1);
  });

  it('throws a ViewInstanceNotFoundError if the view instance does not exist', () => {
    expect(() => getViewInstance('missing')).toThrowError(
      ViewInstanceNotFoundError,
    );
  });
});
