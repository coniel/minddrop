import { DesignElement } from '@minddrop/designs';
import { Text, TextProps } from '@minddrop/ui-primitives';
import { PropertyElementLabel } from '../PropertyElementLabel';

export interface ElementLabelProps extends TextProps {
  element: DesignElement;
}

export const ElementLabel: React.FC<ElementLabelProps> = ({
  element,
  ...other
}) => {
  if ('property' in element) {
    return <PropertyElementLabel element={element} {...other} />;
  }

  return <Text text={`designs.${element.type}.name`} {...other} />;
};
