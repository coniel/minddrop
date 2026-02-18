import { Text, TextProps } from '../Text';
import { mapPropsToClasses } from '../utils';
import './Heading.css';

export interface HeadingProps extends TextProps {
  /**
   * Whether to remove the default margin.
   * @default false
   */
  noMargin?: boolean;
}

export const Heading: React.FC<HeadingProps> = ({
  className,
  noMargin,
  ...other
}) => {
  return (
    <Text
      size="large"
      weight="bold"
      className={mapPropsToClasses({ className, noMargin }, 'heading')}
      {...other}
    />
  );
};
