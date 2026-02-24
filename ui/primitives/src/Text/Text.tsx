import React, { FC } from 'react';
import { i18n } from '@minddrop/i18n';
import { propsToClass } from '../utils';
import './Text.css';

export type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl';
export type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';
export type TextColor =
  | 'regular'
  | 'muted'
  | 'subtle'
  | 'disabled'
  | 'primary'
  | 'danger'
  | 'danger-muted'
  | 'warning'
  | 'info'
  | 'inherit';

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  /*
   * Text content. Use `text` for i18n keys.
   */
  children?: React.ReactNode;

  /*
   * i18n key. Takes precedence over children.
   */
  text?: string;

  /*
   * The rendered element. Defaults to 'span', or 'p' when paragraph is true.
   */
  as?: React.ElementType;

  /*
   * Font size. @default 'base'
   */
  size?: TextSize;

  /*
   * Font weight. @default 'normal'
   */
  weight?: TextWeight;

  /*
   * Text color. @default 'regular'
   */
  color?: TextColor;

  /*
   * Monospace font. Useful for code, version numbers, IDs.
   */
  mono?: boolean;

  /*
   * Renders as a block element with paragraph spacing.
   * Margin is only applied when not the last child.
   * Automatically renders as a 'p' element.
   */
  paragraph?: boolean;

  /*
   * Renders as a block element without paragraph spacing.
   */
  block?: boolean;

  /*
   * Truncates overflowing text with an ellipsis.
   * Requires a width-constrained parent.
   */
  truncate?: boolean;
}

export const Text: FC<TextProps> = ({
  as,
  children,
  className,
  color = 'regular',
  size = 'base',
  weight = 'normal',
  mono = false,
  paragraph = false,
  block = false,
  truncate = false,
  text,
  ...other
}) => {
  const Component = as || (paragraph ? 'p' : 'span');

  const classes = propsToClass('text', {
    size,
    color,
    weight: weight !== 'normal' ? weight : undefined,
    mono: mono || undefined,
    paragraph: paragraph || undefined,
    block: block || undefined,
    truncate: truncate || undefined,
    className,
  });

  return (
    <Component className={classes} {...other}>
      {text ? i18n.t(text) : children}
    </Component>
  );
};
