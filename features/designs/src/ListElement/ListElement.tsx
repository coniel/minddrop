import { ListElementSchema } from '@minddrop/designs';
import { useDesign } from '../DesignProvider';
import { Element } from '../Element';
import { FlexDropContainer } from '../FlexDropContainer';

export interface ListElementProps {
  element: ListElementSchema;
}

export const ListElement: React.FC<ListElementProps> = ({ element }) => {
  const { elements } = useDesign();

  return (
    <FlexDropContainer
      className="list-design"
      id={element.id}
      gap={8}
      direction="row"
    >
      {element.children.map((child) => (
        <Element key={child} element={elements[child]} />
      ))}
    </FlexDropContainer>
  );
};
