import React from 'react';

export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  label: string;
}

export const Button: React.FC<ButtonProps> = ({ label, ...other }) => {
  return (
    <button type="button" {...other}>
      {label}
    </button>
  );
};
