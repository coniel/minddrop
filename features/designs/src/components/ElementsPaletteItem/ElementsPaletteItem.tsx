import React from 'react';
import { ElementTemplates } from '@minddrop/designs';
import { useDraggable } from '@minddrop/selection';
import { Icon, Text } from '@minddrop/ui-primitives';
import {
  DesignElementTemplatesDataKey,
  elementIconMap,
  elementLabelMap,
} from '../../constants';
import './ElementsPaletteItem.css';

export interface ElementsPaletteItemProps {
  type: string;
}

export const ElementsPaletteItem: React.FC<ElementsPaletteItemProps> = ({
  type,
}) => {
  const template = ElementTemplates[type as keyof typeof ElementTemplates];
  const { draggableProps } = useDraggable({
    id: `template-${type}`,
    type: DesignElementTemplatesDataKey,
    data: template,
  });

  return (
    <div className="elements-palette-item" {...draggableProps}>
      <Icon
        name={elementIconMap[type] || 'box'}
        className="elements-palette-item-icon"
      />
      <Text size="sm" text={elementLabelMap[type] || type} />
    </div>
  );
};
