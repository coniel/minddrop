import {
  DesignElement,
  DesignElementConfigs,
  DesignElementSettingControl,
  DesignElementSettingControlComponent,
  DesignElementSettings,
  DesignElementSlotConfig,
  Designs,
  ElementContentFit,
  ElementHeightMode,
  ElementPadding,
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
  Icon,
  RadioToggleHoverMenu,
  RadioToggleHoverMenuOption,
  ToolbarSeparator,
} from '@minddrop/ui-primitives';
import { DesignPropertyPicker } from '../DesignPropertyPicker';
import { BackgroundMenu } from './BackgroundMenu';
import { CornerRadiusMenu } from './CornerRadiusMenu';
import { FontControl } from './FontControl';
import { FontSizeControl } from './FontSizeControl';
import { FontWeightMenu } from './FontWeightMenu';
import { LineHeightControl } from './LineHeightControl';
import { PaddingControl } from './PaddingControl';
import { TextAlignMenu } from './TextAlignMenu';
import { TextColorControl } from './TextColorControl';
import { VerticalAlignMenu } from './VerticalAlignMenu';
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
   * instead of the content fit.
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
   * Degrees the icon is turned clockwise, for modes whose icon reads
   * along the wrong axis as drawn.
   */
  rotation?: number;

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

// The system setting controls keyed by the name a config declares
const SettingControlComponents: Record<
  DesignElementSettingControl,
  DesignElementSettingControlComponent<DesignElement & DesignElementSettings>
> = {
  font: FontControl,
  'font-size': FontSizeControl,
  'line-height': LineHeightControl,
  'font-weight': FontWeightMenu,
  'text-align': TextAlignMenu,
  'vertical-align': VerticalAlignMenu,
  'text-color': TextColorControl,
  background: BackgroundMenu,
  'corner-radius': CornerRadiusMenu,
};

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

// The content fit options in display order
const ContentFitOptions: ElementModeOption<ElementContentFit>[] = [
  {
    mode: 'fixed',
    icon: 'ruler-dimension-line',
    rotation: -90,
    label: 'designsNext.contentFit.fixed',
    description: 'designsNext.contentFit.fixedDescription',
  },
  {
    mode: 'grow',
    icon: 'chevrons-up-down',
    label: 'designsNext.contentFit.grow',
    description: 'designsNext.contentFit.growDescription',
  },
  {
    mode: 'shrink',
    icon: 'chevrons-down-up',
    label: 'designsNext.contentFit.shrink',
    description: 'designsNext.contentFit.shrinkDescription',
  },
  {
    mode: 'natural',
    icon: 'separator-horizontal',
    label: 'designsNext.contentFit.natural',
    description: 'designsNext.contentFit.naturalDescription',
  },
];

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
  const settingControls = config?.settingControls;

  // Whether the element sits on the design's grid rather than being
  // held in another element's slot.
  const onGrid = element.parent === undefined;

  // The elements laid out alongside it, which its pins hold it
  // against.
  const siblings = Designs.resolveChildElements(elements, element.parent);

  // A square element keeps its unit size on both axes, so it takes
  // a pin on each and fits its content on neither.
  const square = config?.square ?? false;

  // Whether the element takes padding
  const paddable = config?.paddable ?? false;

  // The element's content controls: the property it takes its
  // content from, and the control filling its static content.
  const ContentControls = config?.contentControls;
  const propertyTypes = properties ? config?.propertyTypes : undefined;

  // Whether the controls carry a content, a sizing and a settings
  // section, in the order they are rendered.
  const hasContent = Boolean(
    propertyTypes || ContentControls || (properties && config?.slots?.length),
  );
  const hasSizing = onGrid || paddable;
  const hasSettings = Boolean(settingControls?.length);

  // Applies a change to the element
  function updateElement(
    data: Partial<
      Pick<
        DesignElement,
        'widthMode' | 'heightMode' | 'contentFit' | 'padding' | 'property'
      >
    >,
  ) {
    onElementsChange(Designs.updateElement(elements, element.id, data));
  }

  // Maps the element filling a slot to a property, filling the slot
  // when it is empty and emptying it when the property is cleared.
  function changeSlotProperty(
    slot: DesignElementSlotConfig,
    property: string | undefined,
  ) {
    const child = Designs.resolveSlotElement(elements, element.id, slot.name);

    // Empty the slot, a slot with no property being one the element
    // does not render.
    if (!property) {
      onElementsChange(
        child ? Designs.removeElement(elements, child.id) : elements,
      );

      return;
    }

    // Remap the element already filling it
    if (child) {
      onElementsChange(Designs.updateElement(elements, child.id, { property }));

      return;
    }

    // Fill it with a new element of the slot's type, held by this
    // one in that slot.
    onElementsChange([
      ...elements,
      {
        ...Designs.createElement(slot.elementType),
        parent: element.id,
        slot: slot.name,
        property,
      },
    ]);
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

  // Changes how the element's height fits its content
  function handleContentFitChange(contentFit: ElementContentFit) {
    updateElement({ contentFit });
  }

  // Changes the element's padding
  function handlePaddingChange(padding: ElementPadding | undefined) {
    updateElement({ padding });
  }

  // Applies a settings change to the element, making room below it
  // when the change raises its intrinsic minimum height.
  function handleSettingsChange(settings: Record<string, unknown>) {
    // The element with the settings applied
    const updated = { ...element, ...settings };

    // An element held in a slot takes its place from the element
    // holding it, so the change applies to it alone. Its block
    // follows its type size, standing in for what the element
    // holding it renders.
    if (!onGrid) {
      onElementsChange(
        Designs.updateElement(elements, element.id, {
          ...settings,
          rowSpan: config?.resolveMinRowSpan?.(updated) ?? element.rowSpan,
        }),
      );

      return;
    }

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

    if (Designs.hasNeighbourOnSide(element, siblings, option.side)) {
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
        ...resolveModeIcon(option),
        label: t(label),
        tooltip: { title: label, description: resolveModeDescription(option) },
      };
    });
  }

  return (
    <>
      {/** Content controls, which fill the element **/}
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
      {properties &&
        config?.slots?.map((slot) => (
          <SlotPropertyPicker
            key={slot.name}
            slot={slot}
            properties={properties}
            value={
              Designs.resolveSlotElement(elements, element.id, slot.name)
                ?.property
            }
            onValueChange={(property) => changeSlotProperty(slot, property)}
          />
        ))}
      {hasContent && hasSizing && <ToolbarSeparator />}
      {/** Sizing controls, which describe a place on the grid **/}
      {onGrid && (
        <RadioToggleHoverMenu<ElementWidthMode>
          options={resolveModeOptions(
            resolveAvailableModeOptions(WidthModeOptions),
          )}
          value={element.widthMode}
          label={t('designsNext.widthMode.label')}
          onValueChange={handleWidthModeChange}
        />
      )}
      {onGrid && aspectLocked && (
        <RadioToggleHoverMenu<ElementHeightMode>
          options={resolveModeOptions(
            resolveAvailableModeOptions(HeightModeOptions),
          )}
          value={element.heightMode ?? 'fixed-top'}
          label={t('designsNext.heightMode.label')}
          onValueChange={handleHeightModeChange}
        />
      )}
      {onGrid && !aspectLocked && !square && (
        <RadioToggleHoverMenu<ElementContentFit>
          options={resolveModeOptions(ContentFitOptions)}
          value={element.contentFit ?? 'fixed'}
          label={t('designsNext.contentFit.label')}
          onValueChange={handleContentFitChange}
        />
      )}
      {paddable && (
        <PaddingControl
          value={element.padding}
          onValueChange={handlePaddingChange}
        />
      )}
      {(hasContent || hasSizing) && hasSettings && <ToolbarSeparator />}
      {settingControls?.map((control, index) => {
        // A declared name resolves to its system control, anything
        // else is the element type's own.
        const SettingControl =
          typeof control === 'string'
            ? SettingControlComponents[control]
            : control;

        return (
          <SettingControl
            key={typeof control === 'string' ? control : index}
            element={element}
            onChange={handleSettingsChange}
          />
        );
      })}
    </>
  );
};

interface SlotPropertyPickerProps {
  /**
   * The slot the picked property fills.
   */
  slot: DesignElementSlotConfig;

  /**
   * The properties the slot's element can map to.
   */
  properties: PropertiesSchema;

  /**
   * The name of the property the slot's element maps to, or
   * undefined while the slot is empty.
   */
  value?: string;

  /**
   * Callback fired with the picked property's name, or undefined
   * when the None option is picked.
   */
  onValueChange: (property: string | undefined) => void;
}

/**
 * Renders the picker for the property a slot's element maps to,
 * carrying the slot's own label and its element type's icon.
 */
const SlotPropertyPicker: React.FC<SlotPropertyPickerProps> = ({
  slot,
  properties,
  value,
  onValueChange,
}) => {
  // The slot's element type, whose property types it offers
  const config = DesignElementConfigs.get(slot.elementType, false);

  return (
    <DesignPropertyPicker
      properties={properties}
      value={value}
      types={config?.propertyTypes ?? []}
      suggestedTypes={config?.suggestedPropertyTypes}
      icon={config?.icon}
      label={slot.label}
      onValueChange={onValueChange}
    />
  );
};

/**
 * Resolves what a mode option shows: its icon by name, or drawn
 * turned by the mode's rotation.
 *
 * @param option - The mode option.
 * @returns The menu option's icon or content.
 */
function resolveModeIcon<Mode extends string>(
  option: ElementModeOption<Mode>,
): Pick<RadioToggleHoverMenuOption<Mode>, 'icon' | 'content' | 'square'> {
  if (option.rotation === undefined) {
    return { icon: option.icon };
  }

  return {
    content: <Icon name={option.icon} rotation={option.rotation} />,
    square: true,
  };
}
