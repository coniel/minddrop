import React from 'react';
import { UiIconName } from '@minddrop/ui-icons';
import {
  DropdownMenu,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  IconButton,
} from '@minddrop/ui-primitives';
import * as Theme from '../Theme';
import { ThemeVariant } from '../types';

/**
 * Map of theme variant values to their corresponding icons.
 */
const variantIcons: Record<string, UiIconName> = {
  light: 'sun',
  dark: 'moon',
  system: 'monitor',
};

/**
 * Renders a dropdown menu for selecting the theme variant
 * (light, dark, or system).
 */
export const ThemeVariantPicker: React.FC = () => {
  // Get the current variant setting and resolve it
  const variant = Theme.useVariant();
  const resolvedVariant = Theme.resolveVariant(variant);

  // Resolve the icon for the current variant
  const resolvedIcon = variantIcons[resolvedVariant];
  const triggerIcon =
    variant === 'system' ? resolvedIcon : variantIcons[variant];

  return (
    <DropdownMenu
      trigger={<IconButton icon={triggerIcon} label="theme.appearance.label" />}
    >
      <DropdownMenuRadioGroup
        value={variant}
        onValueChange={(value) => Theme.setVariant(value as ThemeVariant)}
      >
        <DropdownMenuRadioItem
          value="light"
          label="theme.appearance.light"
          icon="sun"
        />
        <DropdownMenuRadioItem
          value="dark"
          label="theme.appearance.dark"
          icon="moon"
        />
        <DropdownMenuRadioItem
          value="system"
          label="theme.appearance.system"
          icon="monitor"
        />
      </DropdownMenuRadioGroup>
    </DropdownMenu>
  );
};
