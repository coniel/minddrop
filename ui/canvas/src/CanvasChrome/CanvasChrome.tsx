import './CanvasChrome.css';

/**
 * The side or corner of the chrome that stays on its anchor as
 * the chrome is counter-scaled.
 */
export type CanvasChromeOrigin =
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'left'
  | 'center'
  | 'right'
  | 'bottom-left'
  | 'bottom'
  | 'bottom-right';

export interface CanvasChromeProps {
  /**
   * The side or corner of the chrome that stays on its anchor as
   * the chrome is counter-scaled. Defaults to 'top-left'.
   */
  origin?: CanvasChromeOrigin;

  /**
   * Optional additional class name for the chrome element.
   */
  className?: string;

  /**
   * The chrome contents.
   */
  children: React.ReactNode;
}

/**
 * Renders zoom-independent chrome (toolbars, menus, badges) inside
 * canvas content. The transform layer scales everything within it,
 * so the chrome is counter-scaled to keep its screen size while its
 * position tracks the content it is anchored to. Position it from a
 * parent element, with the origin on the anchored side or corner.
 * Renders at its natural size outside a Canvas.
 */
export const CanvasChrome: React.FC<CanvasChromeProps> = ({
  origin = 'top-left',
  className,
  children,
}) => (
  <div
    className={`ui-canvas-chrome ui-canvas-chrome-origin-${origin}${
      className ? ` ${className}` : ''
    }`}
  >
    {children}
  </div>
);
