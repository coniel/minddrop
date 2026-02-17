import { FlatImagePropertyElement } from '../../../types';
import { ElementIcon } from '../../ElementIcon';
import { ElementLabel } from '../../ElementLabel';
import './DesignStudioImagePropertyElement.css';

export interface DesignStudioImagePropertyElementProps {
  element: FlatImagePropertyElement;
}

export const DesignStudioImagePropertyElement: React.FC<
  DesignStudioImagePropertyElementProps
> = ({ element }) => {
  return (
    <div className="design-studio-image-property-element">
      <ElementIcon element={element} />
      <ElementLabel element={element} />
    </div>
  );
};
