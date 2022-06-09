import React from 'react';
import { useTheme } from 'next-themes';
import ImagePrimitive from 'next/image';
import { Box } from '@modulz/design-system';

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

  css?: Record<string, any>;
}

export const Image: React.FC<ImageProps> = ({
  children,
  srcLight,
  srcDark,
  ...props
}) => {
  const { theme } = useTheme();

  return (
    <Box css={{ my: '$6' }}>
      <Box
        as={ImagePrimitive}
        {...props}
        src={theme === 'light' ? srcLight : srcDark}
        css={{ maxWidth: '100%', verticalAlign: 'middle', ...props.css }}
      />
    </Box>
  );
};
