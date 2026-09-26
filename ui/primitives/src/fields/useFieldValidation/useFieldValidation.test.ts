import { afterEach, describe, expect, it } from 'vitest';
import { i18n } from '@minddrop/i18n';
import { act, cleanup, renderHook } from '@minddrop/test-utils';
import { FieldValidate, useFieldValidation } from './useFieldValidation';

// Rejects every value containing a slash with the invalid name error
const rejectSlashes: FieldValidate<string> = (value) =>
  value.includes('/') ? 'error.invalidDirName' : false;

describe('useFieldValidation', () => {
  afterEach(cleanup);

  it('translates the i18n key a value is rejected with', () => {
    const { result } = renderHook(() => useFieldValidation(rejectSlashes));

    act(() => {
      result.current.validate('a/b');
    });

    expect(result.current.errorText).toBe(i18n.t('error.invalidDirName'));
  });

  it('translates the i18n key with its values', () => {
    const { result } = renderHook(() =>
      useFieldValidation<string>(() => ({
        key: 'databases.settings.contentDefaults.custom.matcherTaken',
        values: { type: 'Images' },
      })),
    );

    act(() => {
      result.current.validate('png');
    });

    expect(result.current.errorText).toBe('Already used by Images');
  });

  it('uses a plain string error as is', () => {
    const { result } = renderHook(() =>
      useFieldValidation<string>(() => ({ string: 'Not allowed' })),
    );

    act(() => {
      result.current.validate('a');
    });

    expect(result.current.errorText).toBe('Not allowed');
  });

  it('returns whether the value is accepted', () => {
    const { result } = renderHook(() => useFieldValidation(rejectSlashes));
    const results: boolean[] = [];

    act(() => {
      results.push(result.current.validate('a/b'));
      results.push(result.current.validate('ab'));
    });

    expect(results).toEqual([false, true]);
  });

  it('clears the error when an accepted value is validated', () => {
    const { result } = renderHook(() => useFieldValidation(rejectSlashes));

    act(() => {
      result.current.validate('a/b');
    });
    act(() => {
      result.current.validate('ab');
    });

    expect(result.current.errorText).toBeUndefined();
  });

  it('clears the error on request', () => {
    const { result } = renderHook(() => useFieldValidation(rejectSlashes));

    act(() => {
      result.current.validate('a/b');
    });
    act(() => {
      result.current.clearError();
    });

    expect(result.current.errorText).toBeUndefined();
  });

  it('accepts every value without a validation', () => {
    const { result } = renderHook(() => useFieldValidation<string>());
    let accepted = false;

    act(() => {
      accepted = result.current.validate('a/b');
    });

    expect(accepted).toBe(true);
    expect(result.current.errorText).toBeUndefined();
  });
});
