import { Combobox as ComboboxPrimitive } from '@base-ui/react/combobox';
import React from 'react';

/* --- ComboboxPopup ---
   Wraps Base UI's Combobox.Popup with default styling. */

export type ComboboxPopupProps = ComboboxPrimitive.Popup.Props;

export const ComboboxPopup = React.forwardRef<
  HTMLDivElement,
  ComboboxPopupProps
>(({ className, ...other }, ref) => (
  <ComboboxPrimitive.Popup
    ref={ref}
    className={`combobox-popup${className ? ` ${className}` : ''}`}
    {...other}
  />
));

ComboboxPopup.displayName = 'ComboboxPopup';
