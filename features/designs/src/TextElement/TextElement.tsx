import { TextElementSchema } from '@minddrop/designs';
import { TextPropertySchema } from '@minddrop/properties';
import './TextElement.css';

export interface TextElementProps {
  element: TextElementSchema;
  property?: TextPropertySchema;
  propertyValue?: string;
}

export const TextElement: React.FC<TextElementProps> = ({ element }) => {
  return <div className="text-element">Text element</div>;
};
