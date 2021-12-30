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
  const { theme } = useTheme();

  return (
    <ImagePrimitive {...props} src={theme === 'light' ? srcLight : srcDark} />
  );
};
