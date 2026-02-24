import { DefaultTypographyStyles } from '@minddrop/designs';
import { propsToClass } from '@minddrop/ui-primitives';
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
      className={`${propsToClass('design-studio-text-property-element', { underline, italic })} ${font}`}
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
