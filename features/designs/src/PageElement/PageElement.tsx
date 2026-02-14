import { PageElementSchema } from '@minddrop/designs';
import { useDesign } from '../DesignProvider';
import { Element } from '../Element';
import { FlexDropContainer } from '../FlexDropContainer';

export interface PageElementProps {
  element: PageElementSchema;
}

export const PageElement: React.FC<PageElementProps> = ({ element }) => {
  const { elements } = useDesign();

  return (
    <FlexDropContainer
      className="page-design"
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
