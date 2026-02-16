import { mapPropsToClasses } from '@minddrop/utils';
import { StyleProps } from '../types';
import { extractStyleProps } from '../utils';
import './Box.css';

export interface BoxProps extends StyleProps {
  /**
   * The content of the Box.
   */
  children?: React.ReactNode;

  /**
   * Class name appended to the generated classe names.
   */
  className?: string;
}

export const Box: React.FC<BoxProps> = ({ children, className, ...other }) => {
  const { styleProps, otherProps } = extractStyleProps(other);

  return (
    <div
      className={mapPropsToClasses({ className, ...styleProps })}
      {...otherProps}
    >
      {children}
    </div>
  );
};
