import { ReactElement } from 'react';
import { ElementSchema } from '@minddrop/designs';
import { useDraggable, useDroppable } from '@minddrop/selection';
import { ContainerElement } from '../ContainerElement';
import { useDesignStudio } from '../DesignStudioProvider';
import { DropIndicator } from '../DropIndicator';
import { ImageElement } from '../ImageElement';
import { StaticTextElement } from '../StaticTextElement';
import { TextElement } from '../TextElement';
import { TitleElement } from '../TitleElement';
import { UrlElement } from '../UrlElement';

export interface ElementProps extends React.HTMLProps<HTMLDivElement> {
  element: ElementSchema;
  index?: number;
}

export const DesignStudioElement: React.FC<ElementProps> = ({
  element,
  index,
}) => {
  const { onDrop } = useDesignStudio();
  const {
    isDraggingOver,
    ref,
    dragHandlers: droppableDragHandlers,
    dropIndicator,
  } = useDroppable({
    index,
    type: 'design-element',
    id: element.id,
    axis: 'horizontal',
    enableInside: false,
    edgeThreshold: 0.5,
    onDrop,
  });
  const draggableDragHandlers = useDraggable({
    id: element.id,
    type: 'design-element',
    data: element,
  });

  let elementComponent: ReactElement<ElementSchema> | null = null;

  switch (element.type) {
    case 'container':
      elementComponent = <ContainerElement element={element} />;
      break;
    case 'static-text':
      elementComponent = <StaticTextElement element={element} />;
      break;
    case 'title':
      elementComponent = <TitleElement element={element} />;
      break;
    case 'text':
      elementComponent = <TextElement element={element} />;
      break;
    case 'url':
      elementComponent = <UrlElement element={element} />;
      break;
    case 'image':
      elementComponent = <ImageElement element={element} />;
      break;
    default:
      elementComponent = null;
  }

  if (!elementComponent) {
    return null;
  }

  const dropIndicatorStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: dropIndicator === 'before' ? -4 : undefined,
    right: dropIndicator === 'after' ? -4 : undefined,
    transform:
      dropIndicator === 'before' ? 'translateX(-100%)' : 'translateX(100%)',
  };

  return (
    <div
      draggable
      ref={ref}
      {...droppableDragHandlers}
      {...draggableDragHandlers}
      style={{ position: 'relative' }}
    >
      {elementComponent}
      {isDraggingOver && (
        <DropIndicator axis="vertical" style={dropIndicatorStyle} />
      )}
    </div>
  );
};
