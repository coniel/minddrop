import React, { useEffect, useState } from 'react';
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
  const [src, setSrc] = useState(srcLight);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setSrc(resolvedTheme === 'dark' ? srcDark : srcLight);
  }, [resolvedTheme, srcLight, srcDark]);

  return <img alt="" {...props} src={src} />;
};
