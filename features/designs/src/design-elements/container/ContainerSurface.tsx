import { CSSProperties, useRef } from 'react';
import {
  ContainerElement,
  ContainerStyle,
  ObjectFit,
  PagePanelElement,
  RootElement,
  createBackdropCss,
  resolveElementStyle,
} from '@minddrop/designs';
import { Fs } from '@minddrop/file-system';
import { useMeasuredImageWidth } from '@minddrop/utils';
import { DesignElement } from '../../DesignElements';
import { useElementProperty } from '../../DesignPropertiesProvider';
import { useLayoutType } from '../../LayoutTypeContext';
import { ParentDirectionProvider } from '../../ParentDirectionContext';
import { useElementCssStyle } from '../../useElementCssStyle';
import { useElementPlaceholderImage } from '../../useElementPlaceholder';
import { useMediaFilePath } from '../../useMediaFilePath';

export interface ContainerSurfaceProps {
  /**
   * The container-like element to render.
   */
  element: ContainerElement | PagePanelElement | RootElement;

  /**
   * Optional CSS class name applied to the container div.
   */
  className?: string;

  /**
   * Additional props spread onto the container div (e.g. the root
   * element's data attribute).
   */
  containerProps?: Record<string, unknown>;

  /**
   * When true, the container fills its parent (used by the layout
   * root to fill the frame content area).
   */
  fill?: boolean;

  /**
   * CSS applied over the element's resolved CSS (e.g. a page
   * panel's runtime width).
   */
  styleOverrides?: CSSProperties;
}

/**
 * Shared display renderer for container-like elements. Renders the
 * container div with its resolved CSS, applies the background image
 * (mapped property value or placeholder) and backdrop overlay, and
 * recursively renders child elements.
 */
export const ContainerSurface: React.FC<ContainerSurfaceProps> = ({
  element,
  className,
  containerProps,
  fill = false,
  styleOverrides,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // The surrounding layout's type, which role styles resolve against
  const layoutType = useLayoutType();
  // Resolve the element's style with its role styles applied. The
  // background is left out of the shape since the root retypes it,
  // and only the shared keys are read here
  const style: Omit<ContainerStyle, 'background'> = resolveElementStyle(
    element,
    layoutType ?? undefined,
  );
  const property = useElementProperty(element.id);
  const placeholderImage = useElementPlaceholderImage(
    element,
    style.backgroundImage,
  );
  const placeholderImagePath = useMediaFilePath(placeholderImage);
  const { width, isMeasured } = useMeasuredImageWidth(containerRef);

  // Use the mapped property value (file path) as background image
  // if available, otherwise fall back to the placeholder image
  const imagePath =
    typeof property?.value === 'string' && property.value
      ? property.value
      : placeholderImagePath;

  const imageSrc = Fs.useImageSrc(imagePath, width);

  // Held back until measured so that the full resolution image is
  // not fetched before the requested width is known
  const paintedImageSrc = isMeasured ? imageSrc : null;

  // The backdrop overlay CSS, null when the container has none
  const backdropCss = createBackdropCss(style);

  const containerCssStyle: CSSProperties = {
    ...useElementCssStyle(element),
    ...(paintedImageSrc &&
      createBackgroundImageCss(paintedImageSrc, style.backgroundImageFit)),
    // Anchor the backdrop overlay and contain its stacking so the
    // negative z-index overlay sits above the container background
    // but below the in-flow children
    ...(backdropCss && { position: 'relative' as const, isolation: 'isolate' }),
    ...(fill && { width: '100%', height: '100%' }),
    ...styleOverrides,
  };

  return (
    <div
      ref={containerRef}
      className={className}
      style={containerCssStyle}
      {...containerProps}
    >
      {backdropCss && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: -1,
            pointerEvents: 'none',
            ...backdropCss,
          }}
        />
      )}
      {/** Children are told how this container stacks them, which
       * is what decides the axis a filled height fills **/}
      <ParentDirectionProvider value={style.direction ?? 'column'}>
        {element.children.map((child) => (
          <DesignElement key={child.id} element={child} />
        ))}
      </ParentDirectionProvider>
    </div>
  );
};

/**
 * Emits the background image CSS for a container, mapping the fit
 * option onto background sizing.
 */
function createBackgroundImageCss(
  imageSrc: string,
  fit?: ObjectFit,
): CSSProperties {
  return {
    backgroundImage: `url("${imageSrc}")`,
    backgroundSize: resolveBackgroundSize(fit),
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };
}

/**
 * Maps a background image fit option onto its background-size value.
 */
function resolveBackgroundSize(fit?: ObjectFit): string {
  if (fit === 'contain') {
    return 'contain';
  }

  if (fit === 'fill') {
    return '100% 100%';
  }

  return 'cover';
}
