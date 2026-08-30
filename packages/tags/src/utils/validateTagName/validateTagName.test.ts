import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { InvalidParameterError } from '@minddrop/utils';
import { cleanup, setup, tag_1 } from '../../test-utils';
import { validateTagName } from './validateTagName';

describe('validateTagName', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the trimmed name', () => {
    expect(validateTagName('  Work  ')).toBe('Work');
  });

  it('throws if the name is empty', () => {
    expect(() => validateTagName('   ')).toThrow(InvalidParameterError);
  });

  it('throws if the name is already in use (case-insensitive)', () => {
    expect(() => validateTagName(tag_1.name.toUpperCase())).toThrow(
      InvalidParameterError,
    );
  });

  it('excludes the given tag from the uniqueness check', () => {
    expect(validateTagName(tag_1.name, tag_1.id)).toBe(tag_1.name);
  });
});
