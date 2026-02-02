import { StaticTextElementSchema } from '@minddrop/designs';
import './StaticTextElement.css';

export interface StaticTextElementProps
  extends React.HTMLProps<HTMLDivElement> {
  element: StaticTextElementSchema;
}

export const StaticTextElement: React.FC<StaticTextElementProps> = ({
  element,
}) => {
  return <div className="static-text-element">{element.value}</div>;
};
