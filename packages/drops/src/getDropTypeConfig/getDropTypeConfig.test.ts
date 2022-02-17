import { DropTypeNotRegisteredError } from '../errors';
import { cleanup, registeredImageDropConfig, setup } from '../test-utils';
import { getDropTypeConfig } from './getDropTypeConfig';

describe('getDropTypeConfig', () => {
  beforeAll(() => {
    setup();
  });

  afterAll(() => {
    cleanup();
  });

  it('returns the appropriate config', () => {
    expect(getDropTypeConfig('image')).toEqual(registeredImageDropConfig);
  });

  it('throws a DropTypeNotRegisteredError if the drop type is not registered', () => {
    expect(() => getDropTypeConfig('not-registered')).toThrowError(
      DropTypeNotRegisteredError,
    );
  });
});
