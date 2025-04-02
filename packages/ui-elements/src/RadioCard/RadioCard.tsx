import {
  RadioGroupIndicator,
  RadioGroupItem,
  RadioGroupItemProps,
} from '@radix-ui/react-radio-group';
import { mapPropsToClasses } from '@minddrop/utils';
import { Box } from '../Box';
import { FieldLabel } from '../FieldLabel';
import { Group } from '../Group';
import { HelperText } from '../HelperText';
import { Stack } from '../Stack';
import './RadioCard.css';

export interface RadioCardProps extends RadioGroupItemProps {
  /**
   * The item label.
   */
  label: string;

  /**
   * The item description.
   */
  description?: string;

  /**
   * Class name appended to the default class list.
   */
  className?: string;
}

export const RadioCard: React.FC<RadioCardProps> = ({
  label,
  description,
  className,
  ...other
}) => {
  return (
    <RadioGroupItem
      {...other}
      className={mapPropsToClasses({ className }, 'radio-card')}
    >
      <Group justify="space-between" wrap="nowrap" bd="subtle" br="lg" p="md">
        <Stack gap="xs" className="label-container">
          <FieldLabel size="regular" label={label} />
          {description && <HelperText text={description} />}
        </Stack>
        <Box className="indicator-container">
          <RadioGroupIndicator className="indicator" />
        </Box>
      </Group>
    </RadioGroupItem>
  );
};
