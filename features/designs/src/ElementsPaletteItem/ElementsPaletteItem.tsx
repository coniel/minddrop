import React from 'react';
import { ElementTemplates } from '@minddrop/designs';
import { useTranslation } from '@minddrop/i18n';
import { useDraggable } from '@minddrop/selection';
import { Icon, Text, Tooltip } from '@minddrop/ui-primitives';
import { MappableIndicator } from '../MappableIndicator';
import {
  DesignElementTemplatesDataKey,
  elementCompatiblePropertyTypesMap,
  elementIconMap,
  elementLabelMap,
  propertyTypeLabelMap,
} from '../constants';
import './ElementsPaletteItem.css';

export interface ElementsPaletteItemProps {
  /**
   * The element type identifier.
   */
  type: string;
}

/**
 * Renders a draggable palette item for a design element type.
 */
export const ElementsPaletteItem: React.FC<ElementsPaletteItemProps> = ({
  type,
}) => {
  const { t } = useTranslation();
  const template = ElementTemplates[type as keyof typeof ElementTemplates];
  const { draggableProps } = useDraggable({
    id: `template-${type}`,
    type: DesignElementTemplatesDataKey,
    data: template,
  });

  const compatibleTypes = elementCompatiblePropertyTypesMap[type] || [];
  const isMappable = compatibleTypes.length > 0;

  const item = (
    <div className="elements-palette-item" {...draggableProps}>
      <Icon
        name={elementIconMap[type] || 'box'}
        className="elements-palette-item-icon"
      />
      <Text size="sm" text={elementLabelMap[type] || type} />
      {isMappable && <MappableIndicator />}
    </div>
  );

  if (!isMappable) {
    return item;
  }

  // Build the tooltip description listing compatible property types
  const typeLabels = compatibleTypes
    .map((propertyType) => t(propertyTypeLabelMap[propertyType]))
    .join(', ');

  return (
    <Tooltip
      title={t('design-studio.mappable.tooltip')}
      description={typeLabels}
      side="right"
    >
      {item}
    </Tooltip>
  );
};
