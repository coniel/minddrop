import { ElementsTreeElement } from './ElementsTreeElement';
import './ElementsTree.css';

export interface ElementsTreeProps {
  /**
   * Callback fired when an element is clicked.
   */
  onClickElement: (elementId: string) => void;
}

export const ElementsTree: React.FC<ElementsTreeProps> = ({
  onClickElement,
}) => {
  return (
    <div className="design-elements-tree">
      <ElementsTreeElement elementId="root" onClick={onClickElement} />
    </div>
  );
};
