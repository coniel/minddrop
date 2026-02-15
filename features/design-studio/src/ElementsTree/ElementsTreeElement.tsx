import { ContentIconName } from '@minddrop/icons';
import { Icon } from '@minddrop/ui-primitives';
import { useElement } from '../DesignStudioStore';
import { ElementIcon } from '../ElementIcon';
import { ElementLabel } from '../ElementLabel';

export interface ElementsTreeElementProps {
  elementId: string;
  contentIcon?: ContentIconName;
  onClick: (elementId: string) => void;
}

export const ElementsTreeElement: React.FC<ElementsTreeElementProps> = ({
  elementId,
  onClick,
}) => {
  const element = useElement(elementId);

  return (
    <div draggable>
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
        <div className="tree-element-children">
          {element.children.map((childId) => (
            <ElementsTreeElement
              key={childId}
              elementId={childId}
              onClick={onClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};
