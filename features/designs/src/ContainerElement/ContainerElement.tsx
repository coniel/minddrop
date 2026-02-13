import { ContainerElementSchema } from '@minddrop/designs';
import { useDesignStudio } from '../DesignStudioProvider';
import { Element } from '../Element';
import { FlexDropContainer } from '../FlexDropContainer';

export interface ContainerElementProps {
  element: ContainerElementSchema;
}

export const ContainerElement: React.FC<ContainerElementProps> = ({
  element,
}) => {
  const { elements } = useDesignStudio();

  return (
    <FlexDropContainer id={element.id} gap={8} direction="column">
      {element.children.map((child) => (
        <Element key={child} element={elements[child]} />
      ))}
    </FlexDropContainer>
  );
};
