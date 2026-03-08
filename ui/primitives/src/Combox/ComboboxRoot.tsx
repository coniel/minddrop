import { Combobox as ComboboxPrimitive } from '@base-ui/react/combobox';

/* --- ComboboxRoot ---
   The raw Base UI root. Wraps the entire combobox composition. */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ComboboxRootProps = ComboboxPrimitive.Root.Props<any, any>;

export const ComboboxRoot = ComboboxPrimitive.Root;
