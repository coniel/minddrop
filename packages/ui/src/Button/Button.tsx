import React from 'react';
import { useTranslation } from '@minddrop/i18n';
import './Button.css';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export const Button: React.FC<ButtonProps> = ({ label, ...other }) => {
  const { t } = useTranslation();

  return (
    <button type="button" className="button" {...other}>
      {t('hello')}
    </button>
  );
};
