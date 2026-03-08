import { Combobox as ComboboxPrimitive } from '@base-ui/react/combobox';
import React from 'react';

/* --- ComboboxPositioner ---
   Wraps Base UI's Combobox.Positioner with a default class
   for z-index layering. */

export type ComboboxPositionerProps = ComboboxPrimitive.Positioner.Props;

export const ComboboxPositioner = React.forwardRef<
  HTMLDivElement,
  ComboboxPositionerProps
>((props, ref) => (
  <ComboboxPrimitive.Positioner
    ref={ref}
    className="combobox-positioner"
    {...props}
  />
));

ComboboxPositioner.displayName = 'ComboboxPositioner';
