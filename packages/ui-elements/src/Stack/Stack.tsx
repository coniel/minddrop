import { mapPropsToClasses } from '@minddrop/utils';
import { BoxProps } from '../Box';
import { Group } from '../Group';
import { Spacing } from '../types';
import './Stack.css';

export interface StackProps extends BoxProps {
  /**
   * The content of the Stack.
   */
  children?: React.ReactNode;

  /**
   * A spacing value or any valid CSS `gap` value, `md` by default.
   */
  gap?: Spacing | number;

  /**
   * Controls justify-content CSS property, 'flex-start' by default.
   */
  justify?: React.CSSProperties['justifyContent'];

  /**
   * Controls align-items CSS property, 'stretch' by default.
   */
  align?: React.CSSProperties['alignItems'];

  /**
   * Custom style object applied to the parent div element.
   */
  style?: React.CSSProperties;
}

export const Stack: React.FC<StackProps> = ({
  children,
  className,
  align = 'stretch',
  justify = 'flex-start',
  ...other
}) => {
  return (
    <Group
      className={mapPropsToClasses({ className }, 'stack')}
      align={align}
      justify={justify}
      {...other}
    >
      {children}
    </Group>
  );
};
