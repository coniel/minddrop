import { InvalidValidatorError, ValidationError } from '@minddrop/utils';
import { setup, cleanup } from '../../test-utils';
import { validateContentColor } from './validateContentColor';

describe('validateContentColor', () => {
  beforeEach(setup);

  afterEach(cleanup);

  describe('invalid value', () => {
    it('throws if the value is not a content-color', () => {
      // Validate a value which is not a valid content-color.
      // Should throw a `ValidationError`.
      expect(() =>
        validateContentColor(
          { type: 'content-color' },
          'the-ocean-after-a-storm',
        ),
      ).toThrowError(ValidationError);
    });

    it('throws if the value is not a color listen in `allowedColors`', () => {
      // Validate a value which is a valid content-color but not
      // one of the colors listed in the validator's `allowedColors`.
      expect(() =>
        validateContentColor(
          { type: 'content-color', allowedColors: ['red', 'green'] },
          'blue',
        ),
      ).toThrowError(ValidationError);
    });
  });

  describe('valid value', () => {
    it('passes if the value is valid and `allowedColors` was omitted', () => {
      // Validate a valid and content color. Should not throw.
      expect(() =>
        validateContentColor(
          {
            type: 'content-color',
          },
          'blue',
        ),
      ).not.toThrow();
    });

    it('passes if the value is a valid and allowed content color', () => {
      // Validate a valid and allowed content color. Should not throw.
      expect(() =>
        validateContentColor(
          {
            type: 'content-color',
            allowedColors: ['red', 'blue'],
          },
          'blue',
        ),
      ).not.toThrow();
    });
  });

  describe('invalid validator', () => {
    it('throws if the validator is not a `content-color` validator', () => {
      // Validate a value using a non `content-color` validator.
      // Should throw a `InvalidValidatorError`.
      expect(() =>
        // @ts-ignore
        validateContentColor({ type: 'string' }, 'blue'),
      ).toThrowError(InvalidValidatorError);
    });

    it('throws if the validator lists an invalid allowed color', () => {
      // Call using a validator which contains an invalid `allowedColors` value.
      // Should throw an `InvalidValidatorError`.
      expect(() =>
        validateContentColor(
          {
            type: 'content-color',
            // @ts-ignore
            allowedColors: ['invalid'],
          },
          'blue',
        ),
      ).toThrowError(InvalidValidatorError);
    });
  });
});
