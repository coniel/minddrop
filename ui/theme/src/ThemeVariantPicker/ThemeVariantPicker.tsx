import React from 'react';
import { useTranslation } from '@minddrop/i18n';
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
  const { t } = useTranslation({ keyPrefix: 'theme.appearance' });

  // Get the current variant setting and resolve it
  const variant = Theme.useVariant();
  const resolvedVariant = Theme.resolveVariant(variant);

  // Resolve the icon for the current variant
  const resolvedIcon = variantIcons[resolvedVariant];
  const triggerIcon =
    variant === 'system' ? resolvedIcon : variantIcons[variant];

  return (
    <DropdownMenu
      trigger={<IconButton icon={triggerIcon} label={t('label')} />}
    >
      <DropdownMenuRadioGroup
        value={variant}
        onValueChange={(value) => Theme.setVariant(value as ThemeVariant)}
      >
        <DropdownMenuRadioItem value="light" label={t('light')} icon="sun" />
        <DropdownMenuRadioItem value="dark" label={t('dark')} icon="moon" />
        <DropdownMenuRadioItem
          value="system"
          label={t('system')}
          icon={resolvedIcon}
        />
      </DropdownMenuRadioGroup>
    </DropdownMenu>
  );
};
