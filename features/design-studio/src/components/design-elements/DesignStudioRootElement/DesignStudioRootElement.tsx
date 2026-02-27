import { createElementCssStyle } from '@minddrop/designs';
import { FlexDropContainer } from '@minddrop/feature-drag-and-drop';
import { handleDropOnGap } from '../../../handleDropOnGap';
import { FlatRootDesignElement } from '../../../types';
import { DesignStudioElement } from '../DesignStudioElement/DesignStudioElement';
import './DesignStudioRootElement.css';

export interface DesignStudioRootElementProps {
  element: FlatRootDesignElement;
}

export const DesignStudioRootElement: React.FC<
  DesignStudioRootElementProps
> = ({ element }) => {
  const { style } = element;

  return (
    <FlexDropContainer
      id="root"
      gap={style.gap}
      direction={style.direction}
      align={style.alignItems}
      justify={style.justifyContent}
      className="design-studio-root-element"
      style={createElementCssStyle(element)}
      onDrop={handleDropOnGap}
    >
      {element.children.map((childId, index) => (
        <DesignStudioElement
          key={childId}
          elementId={childId}
          index={index}
          gap={style.gap}
          isLastChild={index === element.children.length - 1}
        />
      ))}
    </FlexDropContainer>
  );
};
