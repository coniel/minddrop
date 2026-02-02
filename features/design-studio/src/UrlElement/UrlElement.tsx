import { UrlElementSchema } from '@minddrop/designs';
import { UrlPropertySchema } from '@minddrop/properties';
import './UrlElement.css';

export interface UrlElementProps {
  element: UrlElementSchema;
  property?: UrlPropertySchema;
  propertyValue?: string;
}

export const UrlElement: React.FC<UrlElementProps> = ({
  element,
  property,
}) => {
  return <div className="url-element">Url</div>;
};
