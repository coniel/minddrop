import { PropertyDesignElement } from '@minddrop/designs';
import { Text, TextProps } from '@minddrop/ui-primitives';
import { useProperty } from '../DesignStudioStore';

export interface PropertyElementLabelProps extends TextProps {
  element: PropertyDesignElement;
}

export const PropertyElementLabel: React.FC<PropertyElementLabelProps> = ({
  element,
  ...other
}) => {
  const property = useProperty(element.property);

  if (!property) {
    return null;
  }

  return <Text text={property.name} {...other} />;
};
