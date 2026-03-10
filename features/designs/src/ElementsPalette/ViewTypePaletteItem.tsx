import { useMemo } from 'react';
import { DefaultViewElementStyle } from '@minddrop/designs';
import { useTranslation } from '@minddrop/i18n';
import { PropertyType } from '@minddrop/properties';
import { useDraggable } from '@minddrop/selection';
import { UiIconName } from '@minddrop/ui-icons';
import { Icon, Text, Tooltip } from '@minddrop/ui-primitives';
import { ViewType } from '@minddrop/views';
import { MappableIndicator } from '../MappableIndicator';
import {
  DesignElementTemplatesDataKey,
  dataSourcePropertyTypeMap,
  propertyTypeLabelMap,
} from '../constants';

export interface ViewTypePaletteItemProps {
  /**
   * The registered view type to render a palette item for.
   */
  viewType: ViewType;
}

/**
 * Renders a draggable palette item for a registered view type.
 * Creates a view design element template with the specific viewType.
 */
export const ViewTypePaletteItem: React.FC<ViewTypePaletteItemProps> = ({
  viewType,
}) => {
  const { t } = useTranslation();

  // Build a view element template with this specific view type
  const template = {
    type: 'view' as const,
    viewType: viewType.type,
    style: { ...DefaultViewElementStyle },
  };

  const { draggableProps } = useDraggable({
    id: `template-view-${viewType.type}`,
    type: DesignElementTemplatesDataKey,
    data: template,
  });

  // Derive compatible property types from the view type's
  // supported data sources
  const compatiblePropertyLabels = useMemo(() => {
    return viewType.supportedDataSources
      .map((source) => dataSourcePropertyTypeMap[source])
      .filter((type): type is PropertyType => type !== undefined)
      .map((propertyType) => propertyTypeLabelMap[propertyType])
      .join(', ');
  }, [viewType.supportedDataSources]);

  return (
    <Tooltip
      title={'design-studio.mappable.tooltip'}
      stringDescription={compatiblePropertyLabels}
      side="right"
    >
      <div className="elements-palette-item" {...draggableProps}>
        <Icon
          name={(viewType.icon as UiIconName) || 'app-window'}
          className="elements-palette-item-icon"
        />
        <Text size="sm" text={viewType.name} />
        <MappableIndicator />
      </div>
    </Tooltip>
  );
};
