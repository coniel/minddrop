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
  const { resolvedTheme } = useTheme();

  return (
    <img
      alt=""
      {...props}
      src={resolvedTheme === 'light' ? srcLight : srcDark}
    />
  );
};
