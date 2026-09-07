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
import { ContentIconBackground } from '../types';
import { stringifyIcon } from './stringifyIcon';

describe('stringifyIcon', () => {
  it('stringifies a content icon', () => {
    expect(stringifyIcon(contentIcon)).toBe(contentIconString);
  });

  it('stringifies a content icon from another set', () => {
    expect(stringifyIcon(setContentIcon)).toBe(setContentIconString);
  });

  it('stringifies a content icon with a background', () => {
    expect(stringifyIcon(backgroundContentIcon)).toBe(
      backgroundContentIconString,
    );
  });

  it('stringifies a content icon from another set with a background', () => {
    expect(stringifyIcon(setBackgroundContentIcon)).toBe(
      setBackgroundContentIconString,
    );
  });

  it('leaves the default background out', () => {
    expect(
      stringifyIcon({ ...contentIcon, background: ContentIconBackground.None }),
    ).toBe(contentIconString);
  });
});
