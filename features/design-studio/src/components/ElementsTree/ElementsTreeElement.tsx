import { FlexDropContainer } from '@minddrop/feature-drag-and-drop';
import { ContentIconName } from '@minddrop/icons';
import { Icon } from '@minddrop/ui-primitives';
import { useElement } from '../../DesignStudioStore';
import { handleDropOnGap } from '../../handleDropOnGap';
import { DesignElementDragDropHandler } from '../DesignElementDragDropHandler';
import { ElementIcon } from '../ElementIcon';
import { ElementLabel } from '../ElementLabel';

export interface ElementsTreeElementProps {
  elementId: string;
  contentIcon?: ContentIconName;
  onClick: (elementId: string) => void;
  index: number;
  disableDragAndDrop?: boolean;
}

export const ElementsTreeElement: React.FC<ElementsTreeElementProps> = ({
  elementId,
  onClick,
  index,
  disableDragAndDrop = false,
}) => {
  const element = useElement(elementId);
  const gap = 4;

  return (
    <DesignElementDragDropHandler
      disabled={disableDragAndDrop}
      index={index}
      element={element}
      gap={gap}
    >
      <div
        role="button"
        className="tree-element"
        onClick={() => onClick(elementId)}
      >
        <ElementIcon element={element} />
        <ElementLabel color="inherit" weight="medium" element={element} />
        <Icon name="chevron-right" className="chevron-icon" />
      </div>
      {'children' in element && (
        <FlexDropContainer
          id="root"
          gap={gap}
          direction="column"
          justify="start"
          className="tree-element-children"
          onDrop={handleDropOnGap}
        >
          {element.children.map((childId, index) => (
            <ElementsTreeElement
              key={childId}
              index={index}
              elementId={childId}
              onClick={onClick}
            />
          ))}
        </FlexDropContainer>
      )}
    </DesignElementDragDropHandler>
  );
};
