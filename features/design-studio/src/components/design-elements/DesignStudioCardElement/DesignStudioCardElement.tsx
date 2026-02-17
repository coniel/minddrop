import { FlexDropContainer } from '@minddrop/feature-drag-and-drop';
import { handleDropOnGap } from '../../../handleDropOnGap';
import { FlatCardDesignElement } from '../../../types';
import { getContainerGapValue } from '../../../utils/getContainerGapValue';
import { DesignStudioElement } from '../DesignStudioElement';
import './DesignStudioCardElement.css';

export interface DesignStudioCardElementProps {
  element: FlatCardDesignElement;
}

export const DesignStudioCardElement: React.FC<
  DesignStudioCardElementProps
> = ({ element }) => {
  const gap = getContainerGapValue(element);

  return (
    <FlexDropContainer
      id="root"
      gap={gap}
      direction="column"
      justify="start"
      className="design-studio-card-element"
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
