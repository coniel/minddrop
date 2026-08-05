import { Combobox as ComboboxPrimitive } from '@base-ui/react/combobox';

/* --- ComboboxCollection ---
   The raw Base UI collection. Renders the filtered items of the
   parent ComboboxGroup via a render function child. */

export type ComboboxCollectionProps = ComboboxPrimitive.Collection.Props;

export const ComboboxCollection = ComboboxPrimitive.Collection;
