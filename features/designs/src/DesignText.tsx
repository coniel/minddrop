import { DesignElementStyle } from '@minddrop/designs';
import { propsToClass } from '@minddrop/ui-primitives';

export interface DesignTextProps {
  /**
   * The text to render.
   */
  text?: string;

  /**
   * The style of the deisgn element rendering the text.
   */
  style: DesignElementStyle;
}

export const DesignText: React.FC<DesignTextProps> = ({ text, style }) => {
  return (
    <span
      className={propsToClass('design-text', {
        fontFamily: style['font-family'],
        underline: style.underline,
        italic: style.italic,
        textAlign: style['text-align'],
        fontWeight: style['font-weight'],
        textTransform: style['text-transform'],
      })}
    >
      {text}
    </span>
  );
};
