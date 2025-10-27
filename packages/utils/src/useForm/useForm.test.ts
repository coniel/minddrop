import { act, renderHook } from '@testing-library/react-hooks';
import React from 'react';
import { beforeEach, describe, expect, it } from 'vitest';
import { FieldDefinition, useForm } from './useForm';

describe('useForm', () => {
  let fields: FieldDefinition[];

  beforeEach(() => {
    fields = [
      {
        name: 'username',
        defaultValue: 'john',
        required: true,
        validate: (v) => (v.length < 3 ? 'Too short' : undefined),
      },
      {
        name: 'email',
        validate: (v) => (v.includes('@') ? undefined : 'Must contain @'),
        validateAsync: async (v) => {
          await new Promise((r) => setTimeout(r, 10));

          return v === 'taken@example.com' ? 'Email taken' : undefined;
        },
      },
    ];
  });

  it('initializes with default values and empty errors', () => {
    const { result } = renderHook(() => useForm(fields));
    expect(result.current.values).toEqual({ username: 'john', email: '' });
    expect(result.current.errors).toEqual({
      username: undefined,
      email: undefined,
    });
  });

  it('updates field value using setValue()', () => {
    const { result } = renderHook(() => useForm(fields));

    act(() => {
      const event = {
        target: { value: 'Jane' },
      } as React.ChangeEvent<HTMLInputElement>;
      result.current.setValue('username')(event);
    });

    expect(result.current.values.username).toBe('Jane');
  });

  it('updates field value using setFieldValue()', () => {
    const { result } = renderHook(() => useForm(fields));

    act(() => {
      result.current.setFieldValue('username', 'Alice');
    });

    expect(result.current.values.username).toBe('Alice');
  });

  it('validates required field', () => {
    const { result } = renderHook(() => useForm(fields));

    act(() => {
      result.current.setFieldValue('username', '');
    });

    let valid: boolean;

    act(() => {
      valid = result.current.validateField('username');
    });

    expect(valid!).toBe(false);
    expect(result.current.errors.username).toBeDefined();
  });

  it('validates synchronously with custom validator', () => {
    const { result } = renderHook(() => useForm(fields));

    act(() => result.current.setFieldValue('username', 'ab'));

    let valid: boolean;

    act(() => {
      valid = result.current.validateField('username');
    });

    expect(valid!).toBe(false);
    expect(result.current.errors.username).toBe('Too short');
  });

  it('passes synchronous validation', () => {
    const { result } = renderHook(() => useForm(fields));

    act(() => result.current.setFieldValue('username', 'John Doe'));

    let valid: boolean;

    act(() => {
      valid = result.current.validateField('username');
    });

    expect(valid!).toBe(true);
    expect(result.current.errors.username).toBeUndefined();
  });

  it('runs async validation and fails for invalid value', async () => {
    const { result } = renderHook(() => useForm(fields));

    act(() => result.current.setFieldValue('email', 'taken@example.com'));

    const valid = await act(
      async () => await result.current.validateFieldAsync('email'),
    );

    expect(valid).toBe(false);
    expect(result.current.errors.email).toBe('Email taken');
  });

  it('runs async validation and passes for valid value', async () => {
    const { result } = renderHook(() => useForm(fields));

    act(() => result.current.setFieldValue('email', 'valid@example.com'));

    const valid = await act(
      async () => await result.current.validateFieldAsync('email'),
    );

    expect(valid).toBe(true);
    expect(result.current.errors.email).toBeUndefined();
  });

  it('validateAll returns false if any field invalid', () => {
    const { result } = renderHook(() => useForm(fields));

    act(() => {
      result.current.setFieldValue('username', 'ab');
      result.current.setFieldValue('email', 'no-at-symbol');
    });

    let valid: boolean;

    act(() => {
      valid = result.current.validateAll();
    });

    expect(valid!).toBe(false);
    expect(result.current.errors.username).toBe('Too short');
    expect(result.current.errors.email).toBe('Must contain @');
  });

  it('validateAllAsync returns true if all fields valid', async () => {
    const { result } = renderHook(() => useForm(fields));

    act(() => {
      result.current.setFieldValue('username', 'Alice');
      result.current.setFieldValue('email', 'alice@example.com');
    });

    const valid = await act(
      async () => await result.current.validateAllAsync(),
    );

    expect(valid).toBe(true);
  });

  it('validateAllAsync returns false if any async validator fails', async () => {
    const { result } = renderHook(() => useForm(fields));

    act(() => result.current.setFieldValue('email', 'taken@example.com'));

    const valid = await act(
      async () => await result.current.validateAllAsync(),
    );

    expect(valid).toBe(false);
    expect(result.current.errors.email).toBe('Email taken');
  });

  it('reset restores default values and clears errors', () => {
    const { result } = renderHook(() => useForm(fields));

    act(() => {
      result.current.setFieldValue('username', '');
      result.current.setFieldValue('email', 'bad');
    });

    act(() => {
      result.current.validateAll();
    });

    expect(result.current.errors.username).toBeDefined();

    act(() => result.current.reset());

    expect(result.current.values).toEqual({ username: 'john', email: '' });
    expect(result.current.errors).toEqual({
      username: undefined,
      email: undefined,
    });
  });

  it('provides fieldProps with correct bindings', () => {
    const { result } = renderHook(() => useForm(fields));
    const usernameProps = result.current.fieldProps.username;

    expect(usernameProps.name).toBe('username');
    expect(usernameProps.value).toBe('john');
    expect(typeof usernameProps.onChange).toBe('function');
    expect(usernameProps.error).toBeUndefined();
  });

  it('calls onBlur validation when validateOnBlur is true', () => {
    const { result } = renderHook(() =>
      useForm([
        {
          name: 'nickname',
          required: true,
          validateOnBlur: true,
        },
      ]),
    );

    const field = result.current.fieldProps.nickname;

    expect(field.onBlur).toBeDefined();

    act(() => {
      result.current.setFieldValue('nickname', '');
      field.onBlur?.();
    });

    expect(result.current.errors.nickname).toBeDefined();
  });
});
