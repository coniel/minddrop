import {
  DesignElement,
  DesignElementSettings,
  DesignElementSettingsMenuProps,
  ElementBackground,
  ElementCornerRadius,
} from '@minddrop/designs-next';
import { TranslationKey } from '@minddrop/i18n';
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  ToolbarIconButton,
} from '@minddrop/ui-primitives';

interface BackgroundOption {
  /**
   * The background surface the option selects.
   */
  value: ElementBackground;

  /**
   * i18n key of the surface's label.
   */
  label: TranslationKey;
}

interface CornerRadiusOption {
  /**
   * The corner radius the option selects.
   */
  value: ElementCornerRadius;

  /**
   * i18n key of the radius's label.
   */
  label: TranslationKey;
}

// The background surface options in display order
const BackgroundOptions: BackgroundOption[] = [
  { value: 'subtle', label: 'designsNext.settings.background.subtle' },
  { value: 'accent', label: 'designsNext.settings.background.accent' },
  {
    value: 'solid-accent',
    label: 'designsNext.settings.background.solidAccent',
  },
];

// The corner radius options in display order
const CornerRadiusOptions: CornerRadiusOption[] = [
  { value: 'none', label: 'designsNext.settings.cornerRadius.none' },
  { value: 'sm', label: 'designsNext.settings.cornerRadius.sm' },
  { value: 'md', label: 'designsNext.settings.cornerRadius.md' },
  { value: 'lg', label: 'designsNext.settings.cornerRadius.lg' },
  { value: 'full', label: 'designsNext.settings.cornerRadius.full' },
];

/**
 * Renders the background setting group: a dropdown with the
 * element's background surface and corner radius choices.
 */
export const BackgroundSettingsGroup: React.FC<
  DesignElementSettingsMenuProps<DesignElement & DesignElementSettings>
> = ({ element, onSettingsChange }) => {
  // Current values falling back to the element defaults
  const background = element.background ?? 'subtle';
  const cornerRadius = element.cornerRadius ?? 'sm';

  // Applies the chosen background surface
  function handleBackgroundChange(value: string) {
    // Find the option matching the radio value
    const option = BackgroundOptions.find((current) => current.value === value);

    // Apply the option's surface
    if (option) {
      onSettingsChange({ background: option.value });
    }
  }

  // Applies the chosen corner radius
  function handleCornerRadiusChange(value: string) {
    // Find the option matching the radio value
    const option = CornerRadiusOptions.find(
      (current) => current.value === value,
    );

    // Apply the option's radius
    if (option) {
      onSettingsChange({ cornerRadius: option.value });
    }
  }

  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger>
        <ToolbarIconButton
          icon="paint-bucket"
          label="designsNext.settings.background.label"
          tooltip={{
            side: 'top',
            title: 'designsNext.settings.background.label',
          }}
          variant="subtle"
          size="sm"
        />
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuPositioner side="bottom" align="start">
          <DropdownMenuContent minWidth={160}>
            <DropdownMenuGroup>
              <DropdownMenuLabel label="designsNext.settings.background.label" />
              <DropdownMenuRadioGroup
                value={background}
                onValueChange={handleBackgroundChange}
              >
                {BackgroundOptions.map((option) => (
                  <DropdownMenuRadioItem
                    key={option.value}
                    value={option.value}
                    label={option.label}
                  />
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel label="designsNext.settings.cornerRadius.label" />
              <DropdownMenuRadioGroup
                value={cornerRadius}
                onValueChange={handleCornerRadiusChange}
              >
                {CornerRadiusOptions.map((option) => (
                  <DropdownMenuRadioItem
                    key={option.value}
                    value={option.value}
                    label={option.label}
                  />
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenuPositioner>
      </DropdownMenuPortal>
    </DropdownMenuRoot>
  );
};
