import { IconButton } from '@minddrop/ui-primitives';
import { useElement } from '../../DesignStudioStore';
import { ElementLabel } from '../ElementLabel';
import { Typography } from '../style-editors';
import './ElementStyleEditor.css';

export interface ElementStyleEditorProps {
  elementId: string;
  onClose: () => void;
}

export const ElementStyleEditor: React.FC<ElementStyleEditorProps> = ({
  elementId,
  onClose,
}) => {
  const element = useElement(elementId);

  return (
    <div className="element-style-editor">
      <div className="header">
        <IconButton
          label="actions.back"
          icon="chevron-left"
          onClick={onClose}
          color="neutral"
        />
        <ElementLabel
          size="lg"
          color="inherit"
          weight="medium"
          element={element}
        />
        <IconButton
          label="actions.remove"
          icon="more-vertical"
          color="neutral"
          size="lg"
        />
      </div>
      <Typography elementId={element.id} />
    </div>
  );
};
