import { TitleElementSchema } from '@minddrop/designs';
import { TitlePropertySchema } from '@minddrop/properties';
import './TitleElement.css';

export interface TitleElementProps {
  element: TitleElementSchema;
  property?: TitlePropertySchema;
  propertyValue?: string;
}

export const TitleElement: React.FC<TitleElementProps> = ({
  element,
  property,
  propertyValue,
}) => {
  return <div className="title-element">Title element</div>;
};
