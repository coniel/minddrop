import React from 'react';

/**
 * A hook that returns a value and a function to update it.
 *
 * @param defaultValue The default value to use.
 * @returns A tuple containing the value and the function to update it.
 */
export function useInputValue<TValue extends string>(
  defaultValue = '',
): [TValue | '', (event: React.ChangeEvent<HTMLInputElement>) => void] {
  const [value, setValue] = React.useState(defaultValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return [value as TValue, handleChange];
}
