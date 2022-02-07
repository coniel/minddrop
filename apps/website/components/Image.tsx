import React from 'react';
import { useTheme } from 'next-themes';
import ImagePrimitive from 'next/image';

export interface ImageProps {
  /**
   * The light mode imarge src.
   */
  srcLight: string;

  /**
   * The dark mode image src.
   */
  srcDark: string;

  /**
   * The image file's height.
   */
  height: number;

  /**
   * The image file's width.
   */
  width: number;
}

export const Image: React.FC<ImageProps> = ({
  children,
  srcLight,
  srcDark,
  ...props
}) => {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;

  return (
    <ImagePrimitive
      {...props}
      src={currentTheme === 'light' ? srcLight : srcDark}
    />
  );
};
