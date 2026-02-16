import { useElement } from '../../DesignStudioStore';
import { DesignStudioCardElement } from './DesignStudioCardElement';
import { DesignStudioTextPropertyElement } from './DesignStudioTextPropertyElement';

export interface DesignStudioElementProps {
  elementId: string;
}

export const DesignStudioElement: React.FC<DesignStudioElementProps> = ({
  elementId,
}) => {
  const element = useElement(elementId);

  if (!element) {
    return null;
  }

  switch (element.type) {
    case 'text-property':
      return <DesignStudioTextPropertyElement element={element} />;
    case 'card':
      return <DesignStudioCardElement element={element} />;
    default:
      return null;
  }
};
