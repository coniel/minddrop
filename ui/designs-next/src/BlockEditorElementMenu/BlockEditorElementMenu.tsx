import { DesignElement, ElementWidthMode } from '@minddrop/designs-next';
import { TranslationKey, useTranslation } from '@minddrop/i18n';
import { UiIconName } from '@minddrop/ui-icons';
import {
  FloatingToolbar,
  RadioToggleGroup,
  Toggle,
} from '@minddrop/ui-primitives';
import './BlockEditorElementMenu.css';

export interface BlockEditorElementMenuProps {
  /**
   * The selected element the menu configures.
   */
  element: DesignElement;

  /**
   * Whether the element's pin choice is currently overridden by a
   * fluid context neighbour.
   */
  pinOverridden: boolean;

  /**
   * Callback fired when a width mode is chosen.
   */
  onWidthModeChange: (widthMode: ElementWidthMode) => void;

  /**
   * Callback fired when the natural height toggle changes.
   */
  onNaturalHeightChange: (naturalHeight: boolean) => void;
}

interface WidthModeOption {
  /**
   * The width mode the option selects.
   */
  mode: ElementWidthMode;

  /**
   * The icon representing the mode.
   */
  icon: UiIconName;

  /**
   * i18n key of the mode's label.
   */
  label: TranslationKey;

  /**
   * Whether the mode is a pin choice, muted while overridden.
   */
  pin: boolean;
}

// The width mode options in display order
const WidthModeOptions: WidthModeOption[] = [
  {
    mode: 'fluid',
    icon: 'unfold-horizontal',
    label: 'designsNext.widthMode.fluid',
    pin: false,
  },
  {
    mode: 'fixed-left',
    icon: 'arrow-left-to-line',
    label: 'designsNext.widthMode.fixedLeft',
    pin: true,
  },
  {
    mode: 'fixed-center',
    icon: 'align-center-horizontal',
    label: 'designsNext.widthMode.fixedCenter',
    pin: true,
  },
  {
    mode: 'fixed-right',
    icon: 'arrow-right-to-line',
    label: 'designsNext.widthMode.fixedRight',
    pin: true,
  },
];

/**
 * Renders the hovering menu bar for a selected block: the width mode
 * choices and the natural height toggle. Pin choices mute while a
 * fluid context neighbour overrides them, staying interactive since
 * the stored choice matters again once the neighbour changes.
 */
export const BlockEditorElementMenu: React.FC<BlockEditorElementMenuProps> = ({
  element,
  pinOverridden,
  onWidthModeChange,
  onNaturalHeightChange,
}) => {
  const { t } = useTranslation();

  return (
    <FloatingToolbar size="sm" visible className="block-editor-element-menu">
      <RadioToggleGroup<ElementWidthMode>
        value={element.widthMode}
        onValueChange={onWidthModeChange}
      >
        {WidthModeOptions.map((option) => (
          <Toggle
            key={option.mode}
            value={option.mode}
            icon={option.icon}
            label={t(option.label)}
            className={
              option.pin && pinOverridden
                ? 'block-editor-element-menu-pin-overridden'
                : undefined
            }
            tooltip={{
              side: 'top',
              title: option.label,
              description:
                option.pin && pinOverridden
                  ? 'designsNext.widthMode.overridden'
                  : undefined,
            }}
          />
        ))}
      </RadioToggleGroup>
      <Toggle
        icon="unfold-vertical"
        label={t('designsNext.naturalHeight')}
        pressed={element.naturalHeight}
        onPressedChange={onNaturalHeightChange}
        tooltip={{ side: 'top', title: 'designsNext.naturalHeight' }}
      />
    </FloatingToolbar>
  );
};
