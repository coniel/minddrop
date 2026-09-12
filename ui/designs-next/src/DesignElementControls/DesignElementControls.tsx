import {
  DesignElement,
  DesignElementConfigs,
  DesignElementSettingGroup,
  DesignElementSettings,
  DesignElementSettingsControlsProps,
  Designs,
  ElementHeightMode,
  ElementSide,
  ElementWidthMode,
} from '@minddrop/designs-next';
import {
  TranslationKey,
  createI18nKeyBuilder,
  useTranslation,
} from '@minddrop/i18n';
import { PropertiesSchema } from '@minddrop/properties';
import { UiIconName } from '@minddrop/ui-icons';
import {
  FloatingToolbar,
  RadioToggleHoverMenu,
  RadioToggleHoverMenuOption,
  Toggle,
  ToolbarSeparator,
} from '@minddrop/ui-primitives';
import { DesignPropertyPicker } from '../DesignPropertyPicker';
import { BlockControlOffset } from '../constants';
import { BackgroundSettingsGroup } from './BackgroundSettingsGroup';
import { TextSettingsGroup } from './TextSettingsGroup';
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
   * The properties the design's elements can map to, offered as
   * the content of elements which take one. Omitted where the
   * design's owner has none.
   */
  properties?: PropertiesSchema;

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
   * i18n key of the mode's label, for the modes which pin to no
   * side and so read the same whatever surrounds the element.
   */
  label?: TranslationKey;

  /**
   * i18n key of the supporting text under the label, for the modes
   * whose effect the label alone does not carry.
   */
  description?: TranslationKey;

  /**
   * The side the mode pins to, whose label names the design edge or
   * the neighbouring element the pin holds the element against.
   */
  side?: ElementSide;
}

const pinLabelKey = createI18nKeyBuilder('designsNext.pin.label.');
const edgePinKey = createI18nKeyBuilder('designsNext.pin.edge.');
const elementPinKey = createI18nKeyBuilder('designsNext.pin.element.');

// The width mode options in display order
const WidthModeOptions: ElementModeOption<ElementWidthMode>[] = [
  {
    mode: 'fluid',
    icon: 'unfold-horizontal',
    label: 'designsNext.widthMode.fluid',
    description: 'designsNext.widthMode.fluidDescription',
  },
  {
    mode: 'fixed-left',
    icon: 'arrow-left-to-line',
    side: 'left',
  },
  {
    mode: 'fixed-proportional',
    icon: 'align-horizontal-space-around',
    label: 'designsNext.widthMode.proportional',
    description: 'designsNext.widthMode.proportionalDescription',
  },
  {
    mode: 'fixed-right',
    icon: 'arrow-right-to-line',
    side: 'right',
  },
];

// The height mode options in display order
const HeightModeOptions: ElementModeOption<ElementHeightMode>[] = [
  {
    mode: 'fluid',
    icon: 'unfold-vertical',
    label: 'designsNext.heightMode.fluid',
    description: 'designsNext.heightMode.fluidDescription',
  },
  {
    mode: 'fixed-top',
    icon: 'arrow-up-to-line',
    side: 'top',
  },
  {
    mode: 'fixed-proportional',
    icon: 'align-vertical-space-around',
    label: 'designsNext.heightMode.proportional',
    description: 'designsNext.heightMode.proportionalDescription',
  },
  {
    mode: 'fixed-bottom',
    icon: 'arrow-down-to-line',
    side: 'bottom',
  },
];

// The system setting group components keyed by group name
const SettingGroupComponents: Record<
  DesignElementSettingGroup,
  React.FC<
    DesignElementSettingsControlsProps<DesignElement & DesignElementSettings>
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
 * Renders the selected block's sizing, content and settings controls.
 */
const SelectedElementControls: React.FC<SelectedElementControlsProps> = ({
  element,
  elements,
  rows,
  properties,
  aspectLocked = false,
  onElementsChange,
  onRowsChange,
}) => {
  const { t } = useTranslation();

  // The element type's settings controls and system setting groups
  const config = DesignElementConfigs.get(element.type, false);
  const SettingsControls = config?.settingsControls;
  const settingGroups = config?.settingGroups;

  // A square element keeps its unit size on both axes, so it takes
  // a pin on each and grows to its content on neither.
  const square = config?.square ?? false;

  // The element's content controls: the property it takes its
  // content from, and the control filling its static content.
  const ContentControls = config?.contentControls;
  const propertyTypes = properties ? config?.propertyTypes : undefined;

  // Applies a change to the element
  function updateElement(
    data: Partial<
      Pick<
        DesignElement,
        'widthMode' | 'heightMode' | 'naturalHeight' | 'property'
      >
    >,
  ) {
    onElementsChange(
      elements.map((current) =>
        current.id === element.id ? { ...current, ...data } : current,
      ),
    );
  }

  // Changes the property the element takes its content from
  function handlePropertyChange(property: string | undefined) {
    updateElement({ property });
  }

  // Changes the element's own content, which its type serialized
  function handleContentChange(content: string | undefined) {
    handleSettingsChange({ content });
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

  // A pin option is labelled by the side it pins to, the rest by
  // their own label.
  function resolveModeLabel<Mode extends string>(
    option: ElementModeOption<Mode>,
  ): TranslationKey {
    if (!option.side) {
      return option.label!;
    }

    return pinLabelKey(option.side);
  }

  // The supporting text naming what a pin holds the element against:
  // the closest neighbour on its side, or the design's edge when the
  // element is the one closest to it.
  function resolveModeDescription<Mode extends string>(
    option: ElementModeOption<Mode>,
  ): TranslationKey | undefined {
    if (!option.side) {
      return option.description;
    }

    if (Designs.hasNeighbourOnSide(element, elements, option.side)) {
      return elementPinKey(option.side);
    }

    return edgePinKey(option.side);
  }

  // Builds an axis' menu options
  // Drops the fluid mode for a square element, which would stretch
  // out of square on whichever axis scales with the render width.
  function resolveAvailableModeOptions<Mode extends string>(
    modeOptions: ElementModeOption<Mode>[],
  ): ElementModeOption<Mode>[] {
    if (!square) {
      return modeOptions;
    }

    return modeOptions.filter((option) => option.mode !== 'fluid');
  }

  function resolveModeOptions<Mode extends string>(
    modeOptions: ElementModeOption<Mode>[],
  ): RadioToggleHoverMenuOption<Mode>[] {
    return modeOptions.map((option) => {
      const label = resolveModeLabel(option);

      return {
        value: option.mode,
        icon: option.icon,
        label: t(label),
        tooltip: { title: label, description: resolveModeDescription(option) },
      };
    });
  }

  return (
    <>
      <RadioToggleHoverMenu<ElementWidthMode>
        options={resolveModeOptions(
          resolveAvailableModeOptions(WidthModeOptions),
        )}
        value={element.widthMode}
        label={t('designsNext.widthMode.label')}
        onValueChange={handleWidthModeChange}
      />
      {aspectLocked && (
        <RadioToggleHoverMenu<ElementHeightMode>
          options={resolveModeOptions(
            resolveAvailableModeOptions(HeightModeOptions),
          )}
          value={element.heightMode ?? 'fixed-top'}
          label={t('designsNext.heightMode.label')}
          onValueChange={handleHeightModeChange}
        />
      )}
      {!aspectLocked && !square && (
        <Toggle
          icon="unfold-vertical"
          label={t('designsNext.naturalHeight')}
          pressed={element.naturalHeight}
          onPressedChange={handleNaturalHeightChange}
          tooltip={{
            side: 'right',
            sideOffset: BlockControlOffset,
            title: 'designsNext.naturalHeight',
          }}
        />
      )}
      {(propertyTypes || ContentControls) && <ToolbarSeparator />}
      {propertyTypes && properties && (
        <DesignPropertyPicker
          properties={properties}
          value={element.property}
          types={propertyTypes}
          suggestedTypes={config?.suggestedPropertyTypes}
          onValueChange={handlePropertyChange}
        />
      )}
      {ContentControls && (
        <ContentControls
          element={element}
          onContentChange={handleContentChange}
        />
      )}
      {(SettingsControls || (settingGroups && settingGroups.length > 0)) && (
        <ToolbarSeparator />
      )}
      {SettingsControls && (
        <SettingsControls
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
