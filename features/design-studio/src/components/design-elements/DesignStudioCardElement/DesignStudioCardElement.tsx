import { FlatCardDesignElement } from '../../../types';
import { DesignStudioElement } from '../DesignStudioElement';
import './DesignStudioCardElement.css';

export interface DesignStudioCardElementProps {
  element: FlatCardDesignElement;
}

export const DesignStudioCardElement: React.FC<
  DesignStudioCardElementProps
> = ({ element }) => {
  return (
    <div className="design-studio-card-element">
      {element.children.map((childId) => (
        <DesignStudioElement key={childId} elementId={childId} />
      ))}
    </div>
  );
};
