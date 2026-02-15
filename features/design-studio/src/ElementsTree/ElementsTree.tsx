import { DesignElement } from '@minddrop/designs';
import { useDesignStudio } from '../DesignStudioProvider';
import { ElementsTreeElement } from './ElementsTreeElement';
import './ElementsTree.css';

export interface ElementsTreeProps {
  /**
   * Callback fired when an element is clicked.
   */
  onClickElement: (element: DesignElement) => void;
}

export const ElementsTree: React.FC<ElementsTreeProps> = ({
  onClickElement,
}) => {
  const { tree } = useDesignStudio();

  return (
    <div className="design-elements-tree">
      <ElementsTreeElement element={tree} onClick={onClickElement} />
    </div>
  );
};
