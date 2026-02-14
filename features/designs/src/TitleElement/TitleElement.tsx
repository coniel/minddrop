import { TitleElementSchema } from '@minddrop/designs';
import { useDesign } from '../DesignProvider';
import './TitleElement.css';

export interface TitleElementProps {
  element: TitleElementSchema;
}

export const TitleElement: React.FC<TitleElementProps> = ({ element }) => {
  const { propertyValues } = useDesign();

  const propertyValue = propertyValues[element.property] as string;

  return <div className="title-element">{propertyValue}</div>;
};
