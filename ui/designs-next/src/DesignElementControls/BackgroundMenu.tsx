import {
  DesignElement,
  DesignElementSettingControlProps,
  DesignElementSettings,
  ElementBackground,
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
 * Renders the background surface control: a toolbar toggle opening a
 * dropdown of the surfaces an element can be drawn on.
 */
export const BackgroundMenu: React.FC<
  DesignElementSettingControlProps<DesignElement & DesignElementSettings>
> = ({ element, onChange }) => {
  // The surface the element is drawn on, the subtle one by default
  const value = element.background ?? 'subtle';

  // Applies the chosen background surface
  function handleValueChange(picked: string) {
    // Find the option matching the radio value
    const option = BackgroundOptions.find(
      (current) => current.value === picked,
    );

    // Apply the option's surface
    if (option) {
      onChange({ background: option.value });
    }
  }

  return (
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
                value={value}
                onValueChange={handleValueChange}
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
  );
};
