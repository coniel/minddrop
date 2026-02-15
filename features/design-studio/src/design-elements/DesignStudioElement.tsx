import { DesignElement } from '@minddrop/designs';
import { DesignStudioCardElement } from './DesignStudioCardElement';
import { DesignStudioTextPropertyElement } from './DesignStudioTextPropertyElement';

export interface DesignStudioElementProps {
  element: DesignElement;
}

export const DesignStudioElement: React.FC<DesignStudioElementProps> = ({
  element,
}) => {
  switch (element.type) {
    case 'text-property':
      return <DesignStudioTextPropertyElement element={element} />;
    case 'card':
      return <DesignStudioCardElement element={element} />;
    default:
      return null;
  }
};
