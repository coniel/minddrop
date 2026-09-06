import { useCallback, useState } from 'react';

/**
 * A hook to toggle a boolean value.
 *
 * Returns an array with the following elements:
 * 0: boolean indicating the current state of the toggle.
 * 1: a function used to toggle the state of the toggle.
 * 2: a function used to set the state of the toggle.
 *
 * The toggle/set functions are split in order to allow
 * 'toggle' to be used directly as an 'onClick' callback
 * since it takes no arguments.
 */
export function useToggle(
  initialValue: boolean,
): [boolean, () => void, (value: boolean) => void] {
  const [on, setOn] = useState(initialValue);

  // Sets the value
  const handleSet = useCallback((value: boolean) => {
    setOn(value);
  }, []);

  // Toggles the value
  const handleToggle = useCallback(() => {
    setOn((v) => !v);
  }, []);

  return [on, handleToggle, handleSet];
}
