import {
  FontFamilyToken,
  ShadowToken,
  SizeToken,
  SpaceToken,
  SurfaceColorToken,
  TextColorToken,
} from '../tokens';
import {
  BorderBlockStyle,
  MarginStyle,
  PaddingStyle,
  WidthStyle,
} from './blocks';

export type ContainerDirection = 'row' | 'column';

export type ContainerAlign = 'start' | 'center' | 'end';

export type ContainerJustify = 'start' | 'center' | 'end' | 'space-between';

export type BackgroundImageFit = 'cover' | 'contain' | 'fill';

/**
 * Preset backdrop treatments applied over a container's background
 * image: `blur` frosts the whole image, `blur-fade` fades the frost
 * out across the container.
 */
export type BackdropEffect = 'blur' | 'blur-fade';

/**
 * Styles for layout containers, including the layout root. Typography
 * values set here are inherited by child elements.
 */
export interface ContainerStyle
  extends PaddingStyle,
    MarginStyle,
    BorderBlockStyle,
    WidthStyle {
  /**
   * The flex direction children lay out in. Omitted, children stack
   * in a column.
   */
  direction?: ContainerDirection;

  /**
   * The cross-axis alignment of children.
   */
  align?: ContainerAlign;

  /**
   * The main-axis distribution of children.
   */
  justify?: ContainerJustify;

  /**
   * Whether children wrap onto new lines.
   */
  wrap?: boolean;

  /**
   * The gap between children.
   */
  gap?: SpaceToken;

  /**
   * The background surface role.
   */
  background?: SurfaceColorToken;

  /**
   * The elevation shadow.
   */
  shadow?: ShadowToken;

  /**
   * The minimum container height.
   */
  minHeight?: SizeToken;

  /**
   * The background image media file name.
   */
  backgroundImage?: string;

  /**
   * How the background image fits the container.
   */
  backgroundImageFit?: BackgroundImageFit;

  /**
   * The backdrop treatment applied over the background image.
   */
  backdrop?: BackdropEffect;

  /**
   * The font family inherited by child elements.
   */
  fontFamily?: FontFamilyToken;

  /**
   * The text color role inherited by child elements.
   */
  color?: TextColorToken;
}
