import { RichTextElementTypeNotRegisteredError } from '../errors';
import { setup, cleanup, headingElementConfig } from '../test-utils';
import { getRichTextElementConfig } from './getRichTextElementConfig';

describe('getRichTextElementConfig', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the element tyoe config', () => {
    // Get the 'heading-1' config
    const config = getRichTextElementConfig(headingElementConfig.type);

    // Returned cnfig should match registered config
    expect(config).toEqual(headingElementConfig);
  });

  it('throws a RichTextElementTypeNotRegisteredError if the type is not registerd', () => {
    // Get an unregistered config type, should throw an error
    expect(() => getRichTextElementConfig('not-registered')).toThrowError(
      RichTextElementTypeNotRegisteredError,
    );
  });
});
