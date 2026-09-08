import {
  DesignElement,
  DesignElementConfigs,
  DesignElementSettingGroup,
  DesignElementSettings,
  DesignElementSettingsMenuProps,
  Designs,
  ElementHeightMode,
  ElementWidthMode,
} from '@minddrop/designs-next';
import { TranslationKey, useTranslation } from '@minddrop/i18n';
import { UiIconName } from '@minddrop/ui-icons';
import {
  FloatingToolbar,
  RadioToggleHoverMenu,
  RadioToggleHoverMenuOption,
  Toggle,
  ToolbarSeparator,
} from '@minddrop/ui-primitives';
import { BackgroundSettingsGroup } from './BackgroundSettingsGroup';
import { TextSettingsGroup } from './TextSettingsGroup';
import { BlockControlTooltipOffset } from './constants';
import './DesignElementControls.css';

export interface DesignElementControlsProps {
  /**
   * The design's elements, which the selected element's context is
   * read from and whose changes the controls report.
   */
  elements: DesignElement[];

  /**
   * The ID of the element the controls configure. Nothing renders
   * while nothing is selected.
   */
  selectedId: string | null;

  /**
   * The design's height in grid units.
   */
  rows: number;

  /**
   * Whether the design is aspect-locked, offering height modes
   * instead of the natural height toggle.
   */
  aspectLocked?: boolean;

  /**
   * Callback fired with the updated elements when a control
   * changes the element.
   */
  onElementsChange: (elements: DesignElement[]) => void;

  /**
   * Callback fired with the new row count when a change to the
   * element makes room for itself. When omitted, the surface
   * height is not adjustable.
   */
  onRowsChange?: (rows: number) => void;
}

interface ElementModeOption<Mode extends string> {
  /**
   * The mode the option selects.
   */
  mode: Mode;

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
const WidthModeOptions: ElementModeOption<ElementWidthMode>[] = [
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
    icon: 'align-horizontal-space-around',
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

// The height mode options in display order
const HeightModeOptions: ElementModeOption<ElementHeightMode>[] = [
  {
    mode: 'fluid',
    icon: 'unfold-vertical',
    label: 'designsNext.heightMode.fluid',
    pin: false,
  },
  {
    mode: 'fixed-top',
    icon: 'arrow-up-to-line',
    label: 'designsNext.heightMode.fixedTop',
    pin: true,
  },
  {
    mode: 'fixed-center',
    icon: 'align-vertical-space-around',
    label: 'designsNext.heightMode.fixedCenter',
    pin: true,
  },
  {
    mode: 'fixed-bottom',
    icon: 'arrow-down-to-line',
    label: 'designsNext.heightMode.fixedBottom',
    pin: true,
  },
];

// The system setting group components keyed by group name
const SettingGroupComponents: Record<
  DesignElementSettingGroup,
  React.FC<
    DesignElementSettingsMenuProps<DesignElement & DesignElementSettings>
  >
> = {
  text: TextSettingsGroup,
  background: BackgroundSettingsGroup,
};

/**
 * Renders the selected block's toolbar, which comes and goes with
 * the selection: nothing renders while nothing is selected.
 */
export const DesignElementControls: React.FC<DesignElementControlsProps> = ({
  elements,
  selectedId,
  ...controlProps
}) => {
  const element = elements.find((current) => current.id === selectedId);

  if (!element) {
    return null;
  }

  return (
    <FloatingToolbar size="md" visible orientation="vertical">
      <SelectedElementControls
        {...controlProps}
        element={element}
        elements={elements}
      />
    </FloatingToolbar>
  );
};

interface SelectedElementControlsProps
  extends Omit<DesignElementControlsProps, 'selectedId'> {
  /**
   * The element the controls configure.
   */
  element: DesignElement;
}

/**
 * Renders the controls themselves: the width mode menu alongside
 * either the natural height toggle or, in aspect-locked designs,
 * the height mode menu, followed by the element type's own settings
 * menu and its system setting groups. Pin choices mute while a
 * fluid context neighbour overrides them, staying interactive since
 * the stored choice matters again once the neighbour changes.
 */
const SelectedElementControls: React.FC<SelectedElementControlsProps> = ({
  element,
  elements,
  rows,
  aspectLocked = false,
  onElementsChange,
  onRowsChange,
}) => {
  const { t } = useTranslation();

  // The element type's settings menu and system setting groups
  const config = DesignElementConfigs.get(element.type, false);
  const SettingsMenu = config?.settingsMenu;
  const settingGroups = config?.settingGroups;

  // Whether a fluid context neighbour currently overrides the
  // element's pin choices.
  const pinOverridden = Designs.isElementPinOverridden(element, elements);
  const verticalPinOverridden = Designs.isElementVerticalPinOverridden(
    element,
    elements,
  );

  // Applies a change to the element
  function updateElement(
    data: Partial<
      Pick<DesignElement, 'widthMode' | 'heightMode' | 'naturalHeight'>
    >,
  ) {
    onElementsChange(
      elements.map((current) =>
        current.id === element.id ? { ...current, ...data } : current,
      ),
    );
  }

  // Changes the element's width mode
  function handleWidthModeChange(widthMode: ElementWidthMode) {
    updateElement({ widthMode });
  }

  // Changes the element's height mode
  function handleHeightModeChange(heightMode: ElementHeightMode) {
    updateElement({ heightMode });
  }

  // Toggles whether the element grows to its content's height
  function handleNaturalHeightChange(naturalHeight: boolean) {
    updateElement({ naturalHeight });
  }

  // Applies a settings change to the element, making room below it
  // when the change raises its intrinsic minimum height.
  function handleSettingsChange(settings: Record<string, unknown>) {
    // The element with the settings applied
    const updated = { ...element, ...settings };

    // Apply the change, resolving the height constraints before and
    // after it so line-based elements keep their line count.
    const result = Designs.applyElementSettings(
      elements,
      element.id,
      settings,
      {
        rows,
        minRowSpan: config?.resolveMinRowSpan?.(updated),
        rowSpanStep: config?.resolveRowSpanStep?.(updated),
        previousRowSpanStep: config?.resolveRowSpanStep?.(element),
      },
    );

    // Emit the adjusted layout
    onElementsChange(result.elements);

    // Follow the shift with the surface height, floored at the
    // surface minimum. Aspect-locked designs keep their derived row
    // count instead.
    if (result.rows !== rows) {
      onRowsChange?.(Math.max(result.rows, Designs.constants.MinRows));
    }
  }

  // Builds an axis' menu options, muting the pin choices while a
  // fluid neighbour overrides them. They stay interactive, since
  // the stored choice matters again once the neighbour changes.
  function resolveModeOptions<Mode extends string>(
    modeOptions: ElementModeOption<Mode>[],
    overridden: boolean,
    overriddenNote: TranslationKey,
  ): RadioToggleHoverMenuOption<Mode>[] {
    return modeOptions.map((option) => ({
      value: option.mode,
      icon: option.icon,
      label: t(option.label),
      className:
        option.pin && overridden
          ? 'design-element-controls-pin-overridden'
          : undefined,
      tooltip: {
        title: option.label,
        description: option.pin && overridden ? overriddenNote : undefined,
      },
    }));
  }

  return (
    <>
      <RadioToggleHoverMenu<ElementWidthMode>
        options={resolveModeOptions(
          WidthModeOptions,
          pinOverridden,
          'designsNext.widthMode.overridden',
        )}
        value={element.widthMode}
        label={t('designsNext.widthMode.label')}
        onValueChange={handleWidthModeChange}
      />
      {aspectLocked ? (
        <RadioToggleHoverMenu<ElementHeightMode>
          options={resolveModeOptions(
            HeightModeOptions,
            verticalPinOverridden,
            'designsNext.heightMode.overridden',
          )}
          value={element.heightMode ?? 'fluid'}
          label={t('designsNext.heightMode.label')}
          onValueChange={handleHeightModeChange}
        />
      ) : (
        <Toggle
          icon="unfold-vertical"
          label={t('designsNext.naturalHeight')}
          pressed={element.naturalHeight}
          onPressedChange={handleNaturalHeightChange}
          tooltip={{
            side: 'right',
            sideOffset: BlockControlTooltipOffset,
            title: 'designsNext.naturalHeight',
          }}
        />
      )}
      {(SettingsMenu || (settingGroups && settingGroups.length > 0)) && (
        <ToolbarSeparator />
      )}
      {SettingsMenu && (
        <SettingsMenu
          element={element}
          onSettingsChange={handleSettingsChange}
        />
      )}
      {settingGroups?.map((group) => {
        const SettingGroup = SettingGroupComponents[group];

        return (
          <SettingGroup
            key={group}
            element={element}
            onSettingsChange={handleSettingsChange}
          />
        );
      })}
    </>
  );
};
