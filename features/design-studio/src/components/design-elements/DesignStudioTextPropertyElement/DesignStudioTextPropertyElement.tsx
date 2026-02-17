import { DefaultTypographyStyles } from '@minddrop/designs';
import { mapPropsToClasses } from '@minddrop/ui-primitives';
import { FlatTextPropertyElement } from '../../../types';
import './DesignStudioTextPropertyElement.css';

export interface DesignStudioTextPropertyElementProps {
  element: FlatTextPropertyElement;
}

export const DesignStudioTextPropertyElement: React.FC<
  DesignStudioTextPropertyElementProps
> = ({ element }) => {
  const style = { ...DefaultTypographyStyles, ...element.style };
  const font = style['font-family'];
  const underline = style.underline;
  const italic = style.italic;

  return (
    <div
      className={mapPropsToClasses(
        { underline, italic },
        `design-studio-text-property-element ${font}`,
      )}
      style={{
        textAlign: style['text-align'],
        fontWeight: style['font-weight'],
        textTransform: style['text-transform'],
      }}
    >
      {element.property}
    </div>
  );
};
