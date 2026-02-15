import { PropertyDesignElement } from '@minddrop/designs';
import { Text, TextProps } from '@minddrop/ui-primitives';
import { useDatabaseProperty } from '../DatabaseDesignStudioProvider';

export interface PropertyElementLabelProps extends TextProps {
  element: PropertyDesignElement;
}

export const PropertyElementLabel: React.FC<PropertyElementLabelProps> = ({
  element,
  ...other
}) => {
  const property = useDatabaseProperty(element.property);

  if (!property) {
    return null;
  }

  return <Text text={property.name} {...other} />;
};
