import { useTranslation } from '@minddrop/i18n';
import { mapPropsToClasses } from '@minddrop/utils';
import './TextInput.css';

export const TextInput: React.FC<React.HTMLProps<HTMLInputElement>> = ({
  className,
  placeholder,
  ...other
}) => {
  const { t } = useTranslation();

  return (
    <input
      className={mapPropsToClasses({ className }, 'text-input')}
      placeholder={placeholder ? (t(placeholder) as string) : undefined}
      {...other}
    />
  );
};
