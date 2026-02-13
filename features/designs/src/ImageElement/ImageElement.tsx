import { ImageElementSchema } from '@minddrop/designs';
import { ImagePropertySchema } from '@minddrop/properties';
import './ImageElement.css';

export interface ImageElementProps {
  element?: ImageElementSchema;
  property?: ImagePropertySchema;
  propertyValue?: string;
}

export const ImageElement: React.FC<ImageElementProps> = ({ element }) => {
  return <div className="image-element">Image</div>;
};
