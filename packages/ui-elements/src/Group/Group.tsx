import { mapPropsToClasses } from '@minddrop/utils';
import { BoxProps } from '../Box';
import { Size } from '../types';
import { extractStyleProps } from '../utils';
import './Group.css';

export interface GroupProps extends BoxProps {
  /**
   * The content of the Group.
   */
  children?: React.ReactNode;

  /**
   * A spacing value or any valid CSS `gap` value, `md` by default.
   */
  gap?: Size | number;

  /**
   * Controls justify-content CSS property, 'flex-start' by default.
   */
  justify?: React.CSSProperties['justifyContent'];

  /**
   * Controls align-items CSS property, 'flex-start' by default.
   */
  align?: React.CSSProperties['alignItems'];

  /**
   * Controls flex-wrap CSS property, 'wrap' by default.
   */
  wrap?: React.CSSProperties['flexWrap'];

  /**
   * Determines whether each child element should have flex-grow: 1
   * style, false by default.
   */
  grow?: boolean;

  /**
   * Custom style object applied to the parent div element.
   */
  style?: React.CSSProperties;
}

export const Group: React.FC<GroupProps> = ({
  children,
  className,
  grow,
  gap,
  justify,
  align,
  wrap,
  ...other
}) => {
  const { styleProps, otherProps } = extractStyleProps(other);
  const classProps: Record<string, string> = {};
  const style: React.CSSProperties = other.style || {};

  if (typeof gap === 'string') {
    classProps.gap = gap;
  } else if (typeof gap === 'number') {
    style.gap = gap;
  }

  return (
    <div
      className={mapPropsToClasses(
        { className, ...classProps, ...styleProps, grow, justify, align, wrap },
        'group',
      )}
      {...otherProps}
      style={style}
    >
      {children}
    </div>
  );
};
