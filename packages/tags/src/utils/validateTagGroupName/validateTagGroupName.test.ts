import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { InvalidParameterError } from '@minddrop/utils';
import { cleanup, setup, tagGroup_1 } from '../../test-utils';
import { validateTagGroupName } from './validateTagGroupName';

describe('validateTagGroupName', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the trimmed name', () => {
    expect(validateTagGroupName('  Topics  ')).toBe('Topics');
  });

  it('throws if the name is empty', () => {
    expect(() => validateTagGroupName('   ')).toThrow(InvalidParameterError);
  });

  it('throws if the name is already in use (case-insensitive)', () => {
    expect(() => validateTagGroupName(tagGroup_1.name.toUpperCase())).toThrow(
      InvalidParameterError,
    );
  });

  it('excludes the given group from the uniqueness check', () => {
    expect(validateTagGroupName(tagGroup_1.name, tagGroup_1.id)).toBe(
      tagGroup_1.name,
    );
  });
});
