import { useCallback } from 'react';
import { createElementCssStyle } from '@minddrop/designs';
import { FlexDropContainer } from '@minddrop/feature-drag-and-drop';
import { DesignStudioStore } from '../../../DesignStudioStore';
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

  // Select the root element when clicking the root background
  const handleClick = useCallback(() => {
    DesignStudioStore.getState().selectElement('root');
  }, []);

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div onClick={handleClick} style={{ width: '100%', height: '100%' }}>
      <FlexDropContainer
        key={style.direction}
        id="root"
        gap={style.gap}
        direction={style.direction}
        align={style.alignItems}
        justify={style.justifyContent}
        className="design-studio-root-element"
        style={createElementCssStyle(element)}
        onDrop={handleDropOnGap}
        fillEnd
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
    </div>
  );
};
