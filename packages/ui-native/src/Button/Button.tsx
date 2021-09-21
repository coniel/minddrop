import React from 'react';
import { Pressable, PressableProps, Text } from 'react-native';

export interface ButtonProps extends PressableProps {
  label: string;
}

export const Button: React.FC<ButtonProps> = ({ label, ...other }) => {
  return (
    <Pressable {...other}>
      <Text>{label}</Text>
    </Pressable>
  );
};
