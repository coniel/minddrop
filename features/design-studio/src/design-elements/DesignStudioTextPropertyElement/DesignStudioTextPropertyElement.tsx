import { TextPropertyElement } from '@minddrop/designs';
import './DesignStudioTextPropertyElement.css';

export interface DesignStudioTextPropertyElementProps {
  element: TextPropertyElement;
}

export const DesignStudioTextPropertyElement: React.FC<
  DesignStudioTextPropertyElementProps
> = ({ element }) => {
  return (
    <div className="design-studio-text-property-element">
      {element.property}
    </div>
  );
};
