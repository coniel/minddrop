import { Text, TextProps } from '@minddrop/ui-primitives';
import { PropertyElementLabel } from '../PropertyElementLabel';
import { FlatDesignElement } from '../types';

export interface ElementLabelProps extends TextProps {
  element: FlatDesignElement;
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
