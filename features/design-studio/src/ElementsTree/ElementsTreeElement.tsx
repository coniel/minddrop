import { DesignElement } from '@minddrop/designs';
import { ContentIconName } from '@minddrop/icons';
import { Icon } from '@minddrop/ui-primitives';
import { ElementIcon } from '../ElementIcon';
import { ElementLabel } from '../ElementLabel';

export interface ElementsTreeElementProps {
  element: DesignElement;
  contentIcon?: ContentIconName;
  onClick: (element: DesignElement) => void;
}

export const ElementsTreeElement: React.FC<ElementsTreeElementProps> = ({
  element,
  onClick,
}) => {
  return (
    <div draggable>
      <div
        role="button"
        className="tree-element"
        onClick={() => onClick(element)}
      >
        <ElementIcon element={element} />
        <ElementLabel color="inherit" weight="medium" element={element} />
        <Icon name="chevron-right" className="chevron-icon" />
      </div>
      {'children' in element && (
        <div className="tree-element-children">
          {element.children.map((child) => (
            <ElementsTreeElement
              key={child.id}
              element={child}
              onClick={() => onClick(child)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
