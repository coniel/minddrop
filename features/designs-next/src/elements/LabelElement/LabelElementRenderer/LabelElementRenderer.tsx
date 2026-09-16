import { DesignElementProps } from '@minddrop/designs-next';
import { useElementProperty } from '@minddrop/ui-designs-next';
import { TextElementRenderer } from '../../TextElement';
import { LabelElement } from '../LabelElement.types';

/**
 * Renders a label element as the name of the property it maps to,
 * falling back to the text typed on it.
 */
export const LabelElementRenderer: React.FC<
  DesignElementProps<LabelElement>
> = ({ element }) => {
  // Read the property the element maps to
  const property = useElementProperty(element);

  // Render the property's name, falling back to the typed text
  return (
    <TextElementRenderer
      truncate
      element={element}
      text={property?.schema.name ?? element.content}
    />
  );
};
