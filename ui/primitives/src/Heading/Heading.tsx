import { Text, TextProps } from '../Text';
import { mapPropsToClasses } from '../utils';
import './Heading.css';

export const Heading: React.FC<TextProps> = ({ className, ...other }) => {
  return (
    <Text
      size="large"
      weight="bold"
      className={mapPropsToClasses({ className }, 'heading')}
      {...other}
    />
  );
};
