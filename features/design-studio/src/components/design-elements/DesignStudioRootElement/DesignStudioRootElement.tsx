import { useCallback, useMemo } from 'react';
import {
  createElementCssStyle,
  getPlaceholderMediaDirPath,
} from '@minddrop/designs';
import { FlexDropContainer } from '@minddrop/feature-drag-and-drop';
import { Fs } from '@minddrop/file-system';
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

  // Resolve background image path if set
  const imagePath = useMemo(
    () =>
      style.backgroundImage
        ? Fs.concatPath(getPlaceholderMediaDirPath(), style.backgroundImage)
        : null,
    [style.backgroundImage],
  );

  const imageSrc = Fs.useImageSrc(imagePath);

  // Select the root element when clicking the root background
  const handleClick = useCallback(() => {
    DesignStudioStore.getState().selectElement('root');
  }, []);

  return (
    <div onClick={handleClick} style={{ width: '100%', height: '100%' }}>
      <FlexDropContainer
        key={style.direction}
        id="root"
        gap={style.gap}
        direction={style.direction}
        align={style.alignItems}
        justify={style.justifyContent}
        className="design-studio-root-element"
        style={{
          ...createElementCssStyle(element),
          // Apply background image URL resolved from the file system
          ...(imageSrc && { backgroundImage: `url(${imageSrc})` }),
        }}
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
