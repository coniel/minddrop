import { CardElement } from '@minddrop/designs';
import { DesignStudioElement } from '../DesignStudioElement';
import './DesignStudioCardElement.css';

export interface DesignStudioCardElementProps {
  element: CardElement;
}

export const DesignStudioCardElement: React.FC<
  DesignStudioCardElementProps
> = ({ element }) => {
  return (
    <div className="design-studio-card-element">
      {element.children.map((child) => (
        <DesignStudioElement key={child.id} element={child} />
      ))}
    </div>
  );
};
