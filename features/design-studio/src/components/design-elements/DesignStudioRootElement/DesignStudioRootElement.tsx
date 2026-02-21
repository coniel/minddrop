import { FlexDropContainer } from '@minddrop/feature-drag-and-drop';
import { handleDropOnGap } from '../../../handleDropOnGap';
import { FlatRootDesignElement } from '../../../types';
import { getContainerGapValue } from '../../../utils/getContainerGapValue';
import { DesignStudioElement } from '../DesignStudioElement';
import './DesignStudioRootElement.css';

export interface DesignStudioRootElementProps {
  element: FlatRootDesignElement;
}

export const DesignStudioRootElement: React.FC<
  DesignStudioRootElementProps
> = ({ element }) => {
  const gap = getContainerGapValue(element);

  return (
    <FlexDropContainer
      id="root"
      gap={gap}
      direction="column"
      justify="start"
      className="design-studio-root-element"
      onDrop={handleDropOnGap}
    >
      {element.children.map((childId, index) => (
        <DesignStudioElement
          key={childId}
          elementId={childId}
          index={index}
          gap={gap}
          isLastChild={index === element.children.length - 1}
        />
      ))}
    </FlexDropContainer>
  );
};
