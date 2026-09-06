import { TranslationKey, useTranslation } from '@minddrop/i18n';
import { PropertyType } from '@minddrop/properties';
import { UiIconName } from '@minddrop/ui-icons';
import {
  ContentIcon,
  Icon,
  Text,
  Tooltip,
  usePressedState,
} from '@minddrop/ui-primitives';
import { propertyTypeLabelMap } from '../constants';
import { useHoveredItem } from '../useHoveredItem';
import './PaletteItem.css';

export interface PaletteItemProps {
  /**
   * The item's icon.
   */
  icon?: UiIconName;

  /**
   * The item's stringified content icon, for items representing
   * content rather than interface actions.
   * - `content-icon`: '[set-name]:[icon-name]:[color]'
   */
  contentIcon?: string;

  /**
   * The i18n key of the item's label.
   */
  label: TranslationKey;

  /**
   * The property types the item's element can bind to. When any are
   * given, the item lists them in a tooltip.
   */
  compatiblePropertyTypes?: readonly PropertyType[];

  /**
   * The i18n key of a description shown in the item's tooltip, for
   * items which explain themselves rather than binding properties.
   */
  description?: TranslationKey;

  /**
   * Props spread onto the item, making it draggable.
   */
  draggableProps: Record<string, unknown>;
}

/**
 * Renders a draggable palette item for a layout type, design role
 * or element type.
 */
export const PaletteItem: React.FC<PaletteItemProps> = ({
  icon,
  contentIcon,
  label,
  compatiblePropertyTypes = [],
  description,
  draggableProps,
}) => {
  const { t } = useTranslation();
  const { pressedProps } = usePressedState();
  // Items track hover themselves, since a native drag leaves browser
  // hover state stuck on the item it started from.
  const { hoveredProps } = useHoveredItem(`palette:${label}`);
  const isBindable = compatiblePropertyTypes.length > 0;

  const item = (
    <div
      className="designs-palette-item"
      {...hoveredProps}
      {...pressedProps}
      {...draggableProps}
    >
      {icon && <Icon name={icon} className="designs-palette-item-icon" />}
      {contentIcon && (
        <ContentIcon icon={contentIcon} className="designs-palette-item-icon" />
      )}
      <Text size="sm" text={label} />
    </div>
  );

  // Bindable items list the property types they accept
  if (isBindable) {
    const typeLabels = compatiblePropertyTypes
      .map((propertyType) => t(propertyTypeLabelMap[propertyType]))
      .join(', ');

    return (
      <Tooltip
        title="design-studio.mappable.tooltip"
        stringDescription={typeLabels}
        side="right"
      >
        {item}
      </Tooltip>
    );
  }

  // Described items explain what they insert
  if (description) {
    return (
      <Tooltip title={label} description={description} side="right">
        {item}
      </Tooltip>
    );
  }

  return item;
};
