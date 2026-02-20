import { CardElement } from '@minddrop/designs';
import { DesignElementRenderer } from '../../DesignElementRenderer';
import { createContainerStyleObject } from '../../utils';
import './CardElement.css';

export interface DesignCardElementProps {
  /**
   * The card element to render.
   */
  element: CardElement;
}

export const DesignCardElement: React.FC<DesignCardElementProps> = ({
  element,
}) => {
  const style = createContainerStyleObject(element.style);

  return (
    <div className="card-element" style={style}>
      {element.children.map((child) => (
        <DesignElementRenderer key={child.id} element={child} />
      ))}
    </div>
  );
};
