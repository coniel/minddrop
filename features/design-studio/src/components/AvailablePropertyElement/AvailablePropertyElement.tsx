import { useMemo } from 'react';
import { ElementTemplates } from '@minddrop/designs';
import { PropertySchema } from '@minddrop/properties';
import { useDraggable } from '@minddrop/selection';
import { ContentIcon, Text } from '@minddrop/ui-primitives';
import { DesignElementTemplatesDataKey } from '../../constants';
import './AvailablePropertyElement.css';

export interface AvailablePropertyElementProps {
  property: PropertySchema;
}

export const AvailablePropertyElement: React.FC<
  AvailablePropertyElementProps
> = ({ property }) => {
  const template = useMemo(() => {
    return {
      // TODO: Remove this ignore
      // @ts-expect-error - Will be fixed when all templates have been created
      ...ElementTemplates[`${property.type}-property`],
      property: property.name,
    };
  }, [property.type, property.name]);

  const { draggableProps } = useDraggable({
    id: property.name,
    type: DesignElementTemplatesDataKey,
    data: template,
  });

  return (
    <div className="available-property-element" {...draggableProps}>
      <ContentIcon icon={property.icon} />
      <Text size="small" weight="medium" text={property.name} />
    </div>
  );
};
