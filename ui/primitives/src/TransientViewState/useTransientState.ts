import { useCallback, useState } from 'react';
import { useTransientViewStateContext } from './TransientViewStateContext';
import { useTransientViewStateKey } from './TransientViewStateScope';

/*
 * Persists a piece of view UI state (e.g. a nav selection) via
 * the surrounding transient view state context. Falls back to
 * plain local state when no provider is present or the key is
 * undefined, allowing components to thread an optional opt-in
 * prop straight through.
 *
 * The stored value is only read on mount, external changes to
 * it are not observed.
 */
export function useTransientState<Value>(
  key: string | undefined,
  defaultValue: Value,
): [Value, (value: Value) => void] {
  // Storage backend, null when no provider is present or
  // persistence is not opted into
  const backend = useTransientViewStateContext();
  const context = key === undefined ? null : backend;

  // Full key including the accumulated scope path
  const fullKey = useTransientViewStateKey(key ?? '');

  // Initialize from the stored value, falling back to the default
  const [value, setValue] = useState<Value>(() => {
    const stored = context?.get(fullKey);

    return stored === undefined ? defaultValue : (stored as Value);
  });

  // Update local state and write through to the backend
  const setTransientValue = useCallback(
    (nextValue: Value) => {
      // Update the locally rendered value
      setValue(nextValue);

      // Persist the value when a backend is present
      context?.set(fullKey, nextValue);
    },
    [context, fullKey],
  );

  return [value, setTransientValue];
}
