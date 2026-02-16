import * as Label from '@radix-ui/react-label';
import { useTranslation } from '@minddrop/i18n';
import { mapPropsToClasses } from '@minddrop/utils';
import { Text } from '../Text';
import { TextColor, TextSize } from '../types';

export interface FieldLabelProps extends Label.LabelProps {
  /**
   * I18N key of translatable label text.
   */
  label?: string;

  /**
   * Children can be passed for more control over the
   * label text rendering.
   */
  children?: React.ReactNode;

  /**
   * The size of the text.
   */
  size?: TextSize;

  /**
   * The color of the text.
   */
  color?: TextColor;
}

export const FieldLabel: React.FC<FieldLabelProps> = ({
  label,
  children,
  className,
  size = 'small',
  color = 'muted',
  ...other
}) => {
  const { t } = useTranslation();

  return (
    <Label.Root
      className={mapPropsToClasses({ className }, 'field-label')}
      {...other}
    >
      <Text size={size} color={color} weight="medium">
        {label ? t(label) : null}
        {children}
      </Text>
    </Label.Root>
  );
};
