import { Text, TextProps } from '../Text';
import { mapPropsToClasses } from '../utils';
import './Subheading.css';

export interface SubheadingProps extends TextProps {
  /**
   * Whether to remove the default margin.
   * @default false
   */
  noMargin?: boolean;
}

export const Subheading: React.FC<SubheadingProps> = ({
  className,
  noMargin,
  ...other
}) => {
  return (
    <Text
      weight="bold"
      className={mapPropsToClasses({ className, noMargin }, 'subheading')}
      {...other}
    />
  );
};
