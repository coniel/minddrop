import { describe, expect, it } from 'vitest';
import {
  backgroundContentIcon,
  backgroundContentIconString,
  contentIcon,
  contentIconString,
  setBackgroundContentIcon,
  setBackgroundContentIconString,
  setContentIcon,
  setContentIconString,
} from '../test-utils';
import { UserIconContentIcon } from '../types';
import { parseIcon } from './parseIcon';

describe('parseIcon', () => {
  it('parses content icons', () => {
    expect(parseIcon(contentIconString)).toEqual<UserIconContentIcon>(
      contentIcon,
    );
  });

  it('parses content icons with an explicit set', () => {
    expect(parseIcon(setContentIconString)).toEqual<UserIconContentIcon>(
      setContentIcon,
    );
  });

  it('parses content icons with a background', () => {
    expect(parseIcon(backgroundContentIconString)).toEqual<UserIconContentIcon>(
      backgroundContentIcon,
    );
  });

  it('parses content icons with an explicit set and a background', () => {
    expect(
      parseIcon(setBackgroundContentIconString),
    ).toEqual<UserIconContentIcon>(setBackgroundContentIcon);
  });

  it('leaves the default background out of the parsed icon', () => {
    const result = parseIcon(`${contentIconString}:none`);

    expect(result).toEqual<UserIconContentIcon>(contentIcon);
    expect(result).not.toHaveProperty('background');
  });

  it('returns null for missing icon set', () => {
    expect(parseIcon('my-icons:burger:green')).toBeNull();
  });

  it('returns null for undefined values', () => {
    expect(parseIcon()).toBeNull();
  });

  it('returns null for invalid values', () => {
    expect(parseIcon('foo')).toBeNull();
  });
});
