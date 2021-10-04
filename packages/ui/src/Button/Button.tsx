import React from 'react';
import { useTranslation } from '@minddrop/i18n';
import { styled } from '@minddrop/styles';

export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  label: string;
}

const BaseButton = styled('button', {
  background: '$gray400',
  borderRadius: 4,
  border: 'none',
  padding: '5px 10px',
});

export const Button: React.FC<ButtonProps> = ({ label, ...other }) => {
  const { t } = useTranslation();

  return (
    <BaseButton type="button" {...other}>
      {t('hello')}
    </BaseButton>
  );
};
