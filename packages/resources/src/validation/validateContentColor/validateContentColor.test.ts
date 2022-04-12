import { ValidationError } from '@minddrop/utils';
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
});
