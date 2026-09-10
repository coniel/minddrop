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
  DropdownMenuTrigger,
  ToolbarIconButton,
} from '@minddrop/ui-primitives';
import { BlockControlOffset } from '../constants';
import { CornerRadiusMenu } from './CornerRadiusMenu';

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

// The background surface options in display order
const BackgroundOptions: BackgroundOption[] = [
  { value: 'subtle', label: 'designsNext.settings.background.subtle' },
  { value: 'accent', label: 'designsNext.settings.background.accent' },
  {
    value: 'solid-accent',
    label: 'designsNext.settings.background.solidAccent',
  },
];

/**
 * Renders the background setting group: a dropdown of the element's
 * background surfaces, with its corner radius menu beside it.
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
  function handleCornerRadiusChange(cornerRadius: ElementCornerRadius) {
    onSettingsChange({ cornerRadius });
  }

  return (
    <>
      <DropdownMenuRoot>
        <DropdownMenuTrigger>
          <ToolbarIconButton
            icon="paint-bucket"
            label="designsNext.settings.background.label"
            tooltip={{
              side: 'right',
              sideOffset: BlockControlOffset,
              title: 'designsNext.settings.background.label',
            }}
            variant="subtle"
            size="sm"
          />
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuPositioner
            side="bottom"
            align="start"
            sideOffset={BlockControlOffset}
          >
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
            </DropdownMenuContent>
          </DropdownMenuPositioner>
        </DropdownMenuPortal>
      </DropdownMenuRoot>

      <CornerRadiusMenu
        radius={cornerRadius}
        onRadiusChange={handleCornerRadiusChange}
      />
    </>
  );
};
