export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type Border = 'subtle' | 'strong';

export type FontSize = Size;
export type Radius = Size;
export type Spacing = Size;
export type Shadow = Size;
export type LineHeight = Size;

export type ColorName =
  | 'default'
  | 'blue'
  | 'cyan'
  | 'red'
  | 'pink'
  | 'purple'
  | 'green'
  | 'orange'
  | 'yellow'
  | 'brown'
  | 'gray';
export type ColorShade = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type Color = `${ColorName}-${ColorShade}`;

export interface StyleProps {
  /** Margin */
  m?: Spacing;
  /** MarginBlock */
  my?: Spacing;
  /** MarginInline */
  mx?: Spacing;
  /** MarginTop */
  mt?: Spacing;
  /** MarginBottom */
  mb?: Spacing;
  /** MarginInlineStart */
  ms?: Spacing;
  /** MarginInlineEnd */
  me?: Spacing;
  /** MarginLeft */
  ml?: Spacing;
  /** MarginRight */
  mr?: Spacing;

  /** Padding */
  p?: Spacing;
  /** PaddingBlock */
  py?: Spacing;
  /** PaddingInline */
  px?: Spacing;
  /** PaddingTop */
  pt?: Spacing;
  /** PaddingBottom */
  pb?: Spacing;
  /** PaddingInlineStart */
  ps?: Spacing;
  /** PaddingInlineEnd */
  pe?: Spacing;
  /** PaddingLeft */
  pl?: Spacing;
  /** PaddingRight */
  pr?: Spacing;

  /** BorderRadius */
  br?: Radius;
  /** BorderTopLeftRadius */
  btlr?: Radius;
  /** BorderTopRightRadius */
  btrr?: Radius;
  /** BorderBottomLeftRadius */
  bblr?: Radius;
  /** BorderBottomRightRadius */
  bbrr?: Radius;

  /** Border */
  bd?: Border;
  /** Background, theme key: theme.colors */
  bg?: Color;
  /** Color */
  c?: Color;
  opacity?: React.CSSProperties['opacity'];

  /** FontFamily */
  ff?: 'monospace' | 'text' | 'heading';
  /** FontSize, theme key: theme.fontSizes */
  fz?: FontSize | `h${1 | 2 | 3 | 4 | 5 | 6}`;
  /** FontWeight */
  fw?: React.CSSProperties['fontWeight'];
  /** LetterSpacing */
  lts?: React.CSSProperties['letterSpacing'];
  /** TextAlign */
  ta?: React.CSSProperties['textAlign'];
  /** LineHeight, theme key: lineHeights */
  lh?: LineHeight | `h${1 | 2 | 3 | 4 | 5 | 6}`;
  /** FontStyle */
  fs?: React.CSSProperties['fontStyle'];
  /** TextTransform */
  tt?: React.CSSProperties['textTransform'];
  /** TextDecoration */
  td?: React.CSSProperties['textDecoration'];

  /** Width */
  w?: React.CSSProperties['width'];
  /** MinWidth*/
  miw?: React.CSSProperties['minWidth'];
  /** MaxWidth */
  maw?: React.CSSProperties['maxWidth'];
  /** Height */
  h?: React.CSSProperties['height'];
  /** MinHeight */
  mih?: React.CSSProperties['minHeight'];
  /** MaxHeight */
  mah?: React.CSSProperties['maxHeight'];

  /** BackgroundSize */
  bgsz?: React.CSSProperties['backgroundSize'];
  /** BackgroundPosition */
  bgp?: React.CSSProperties['backgroundPosition'];
  /** BackgroundRepeat */
  bgr?: React.CSSProperties['backgroundRepeat'];
  /** BackgroundAttachment */
  bga?: React.CSSProperties['backgroundAttachment'];

  /** Position */
  pos?: React.CSSProperties['position'];
  top?: React.CSSProperties['top'];
  left?: React.CSSProperties['left'];
  bottom?: React.CSSProperties['bottom'];
  right?: React.CSSProperties['right'];
  inset?: React.CSSProperties['inset'];

  display?: React.CSSProperties['display'];
  flex?: React.CSSProperties['flex'];
}
