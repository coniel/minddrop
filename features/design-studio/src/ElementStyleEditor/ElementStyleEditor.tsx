import { DesignElement } from '@minddrop/designs';
import { IconButton } from '@minddrop/ui-primitives';
import { ElementLabel } from '../ElementLabel';
import './ElementStyleEditor.css';

export interface ElementStyleEditorProps {
  element: DesignElement;
  onClose: () => void;
}

export const ElementStyleEditor: React.FC<ElementStyleEditorProps> = ({
  element,
  onClose,
}) => {
  return (
    <div className="element-style-editor">
      <div className="header">
        <IconButton
          label="actions.back"
          icon="chevron-left"
          onClick={onClose}
          color="light"
        />
        <ElementLabel
          size="large"
          color="inherit"
          weight="medium"
          element={element}
        />
        <IconButton
          label="actions.remove"
          icon="trash"
          color="light"
          size="small"
        />
      </div>
    </div>
  );
};
