import React from 'react';
import { UiIconName } from '@minddrop/ui-icons';
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSwitchItem,
  IconButton,
} from '@minddrop/ui-primitives';
import { ImageDimming, Theme, ThemeVariant } from '@minddrop/ui-theme';

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
 * (light, dark, or system) and how images are treated in dark mode.
 */
export const ThemeVariantPicker: React.FC = () => {
  // Get the current variant setting and resolve it
  const variant = Theme.useVariant();
  const resolvedVariant = Theme.resolveVariant(variant);
  const imageDimming = Theme.useImageDimming();
  const invertLightImages = Theme.useInvertLightImages();

  // Resolve the icon for the current variant
  const resolvedIcon = variantIcons[resolvedVariant];
  const triggerIcon =
    variant === 'system' ? resolvedIcon : variantIcons[variant];

  // The image treatments only apply while the dark theme is active
  const imageTreatmentsDisabled = resolvedVariant !== 'dark';

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

      <DropdownMenuSeparator />

      {/** How strongly bright images are dimmed in dark mode **/}
      <DropdownMenuGroup label="theme.imageDimming.label">
        <DropdownMenuRadioGroup
          value={imageDimming}
          onValueChange={(value) =>
            Theme.setImageDimming(value as ImageDimming)
          }
        >
          <DropdownMenuRadioItem
            value="off"
            label="theme.imageDimming.off"
            disabled={imageTreatmentsDisabled}
          />
          <DropdownMenuRadioItem
            value="1"
            label="theme.imageDimming.1"
            disabled={imageTreatmentsDisabled}
          />
          <DropdownMenuRadioItem
            value="2"
            label="theme.imageDimming.2"
            disabled={imageTreatmentsDisabled}
          />
          <DropdownMenuRadioItem
            value="3"
            label="theme.imageDimming.3"
            disabled={imageTreatmentsDisabled}
          />
        </DropdownMenuRadioGroup>
      </DropdownMenuGroup>

      <DropdownMenuSeparator />

      {/** Whether light background images are inverted **/}
      <DropdownMenuSwitchItem
        label="theme.invertLightImages.label"
        checked={invertLightImages}
        onCheckedChange={Theme.setInvertLightImages}
        disabled={imageTreatmentsDisabled}
      />
    </DropdownMenu>
  );
};
