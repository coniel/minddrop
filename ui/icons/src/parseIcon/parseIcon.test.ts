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
import { UserIcon } from '../types';
import { parseIcon } from './parseIcon';

describe('parseIcon', () => {
  it('parses content icons', () => {
    expect(parseIcon(contentIconString)).toEqual<UserIcon>(contentIcon);
  });

  it('parses content icons from another set', () => {
    expect(parseIcon(setContentIconString)).toEqual<UserIcon>(setContentIcon);
  });

  it('parses content icons with a background', () => {
    expect(parseIcon(backgroundContentIconString)).toEqual<UserIcon>(
      backgroundContentIcon,
    );
  });

  it('parses content icons from another set with a background', () => {
    expect(parseIcon(setBackgroundContentIconString)).toEqual<UserIcon>(
      setBackgroundContentIcon,
    );
  });

  it('leaves the default background out of the parsed icon', () => {
    const result = parseIcon(`${contentIconString}:none`);

    expect(result).toEqual<UserIcon>(contentIcon);
    expect(result).not.toHaveProperty('background');
  });

  it('returns null for missing segments', () => {
    expect(parseIcon('burger:green')).toBeNull();
  });

  it('returns null for an unknown background', () => {
    expect(parseIcon(`${contentIconString}:foo`)).toBeNull();
  });

  it('returns null for undefined values', () => {
    expect(parseIcon()).toBeNull();
  });

  it('returns null for invalid values', () => {
    expect(parseIcon('foo')).toBeNull();
  });
});
