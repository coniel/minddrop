import {
  DefaultTypographyStyles,
  TextPropertyElement,
} from '@minddrop/designs';
import { mapPropsToClasses } from '@minddrop/ui-primitives';
import './DesignStudioTextPropertyElement.css';

export interface DesignStudioTextPropertyElementProps {
  element: TextPropertyElement;
}

export const DesignStudioTextPropertyElement: React.FC<
  DesignStudioTextPropertyElementProps
> = ({ element }) => {
  const style = { ...DefaultTypographyStyles, ...element.style };
  const font = style['font-family'];

  return (
    <div
      className={mapPropsToClasses(
        { font },
        'design-studio-text-property-element',
      )}
      style={{
        textAlign: style['text-align'],
      }}
    >
      {element.property}
    </div>
  );
};
