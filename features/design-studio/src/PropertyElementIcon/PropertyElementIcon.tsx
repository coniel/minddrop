import { PropertyDesignElement } from '@minddrop/designs';
import { ContentIcon, ContentIconProps } from '@minddrop/ui-primitives';
import { useDatabaseProperty } from '../DatabaseDesignStudioProvider';

export interface PropertyElementIconProps extends ContentIconProps {
  element: PropertyDesignElement;
}

export const PropertyElementIcon: React.FC<PropertyElementIconProps> = ({
  element,
}) => {
  const property = useDatabaseProperty(element.property);

  if (!property) {
    return null;
  }

  return <ContentIcon icon={property.icon} />;
};
