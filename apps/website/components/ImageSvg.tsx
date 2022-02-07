import React from 'react';
import { useTheme } from 'next-themes';

export interface ImageSvgProps {
  className?: string;

  /**
   * The light mode imarge src.
   */
  srcLight: string;

  /**
   * The dark mode image src.
   */
  srcDark: string;
}

export const ImageSvg: React.FC<ImageSvgProps> = ({
  children,
  srcLight,
  srcDark,
  ...props
}) => {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;

  return <img {...props} src={currentTheme === 'light' ? srcLight : srcDark} />;
};
