import { Text, TextProps } from '../Text';
import { mapPropsToClasses } from '../utils';
import './Subheading.css';

export const Subheading: React.FC<TextProps> = ({ className, ...other }) => {
  return (
    <Text
      weight="bold"
      className={mapPropsToClasses({ className }, 'subheading')}
      {...other}
    />
  );
};
