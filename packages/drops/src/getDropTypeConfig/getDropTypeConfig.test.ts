import { DropTypeNotRegisteredError } from '../errors';
import { cleanup, imageDropConfig, initialize } from '../tests';
import { getDropTypeConfig } from './getDropTypeConfig';

describe('getDropTypeConfig', () => {
  beforeAll(() => {
    initialize();
  });

  afterAll(() => {
    cleanup();
  });

  it('returns the appropriate config', () => {
    expect(getDropTypeConfig('image')).toEqual(imageDropConfig);
  });

  it('throws a DropTypeNotRegisteredError if the drop type is not registered', () => {
    expect(() => getDropTypeConfig('not-registered')).toThrowError(
      DropTypeNotRegisteredError,
    );
  });
});
