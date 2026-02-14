import { CardElementSchema } from '@minddrop/designs';
import { useDesign } from '../DesignProvider';
import { Element } from '../Element';
import { FlexDropContainer } from '../FlexDropContainer';

export interface CardElementProps {
  element: CardElementSchema;
}

export const CardElement: React.FC<CardElementProps> = ({ element }) => {
  const { elements } = useDesign();

  return (
    <FlexDropContainer
      className="card-design"
      id={element.id}
      gap={8}
      direction="column"
    >
      {element.children.map((child) => (
        <Element key={child} element={elements[child]} />
      ))}
    </FlexDropContainer>
  );
};
