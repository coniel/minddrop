import {
  DesignElementProps,
  DesignElementSettings,
  Designs,
} from '@minddrop/designs-next';
import { Image } from '@minddrop/ui-components';
import {
  resolveElementStyle,
  useElementFilePath,
} from '@minddrop/ui-designs-next';
import { Group, Icon } from '@minddrop/ui-primitives';
import { ImageElement } from '../ImageElement.types';
import { DefaultImageFit } from '../constants';
import './ImageElementRenderer.css';

// The corners an image is drawn with without settings of its own
const ImageDefaults: DesignElementSettings = {
  cornerRadius: Designs.constants.DefaultCornerRadius,
};

/**
 * Renders an image element as the picture of the image property it
 * maps to.
 */
export const ImageElementRenderer: React.FC<
  DesignElementProps<ImageElement>
> = ({ element }) => {
  // Read the path of the picture the element maps to
  const path = useElementFilePath(element);
  // Resolve the corner radius into the style it renders as
  const style = resolveElementStyle(element, ImageDefaults);

  // Render the placeholder when the element has no picture
  if (!path) {
    return (
      <Group
        className="design-image-element design-image-element-placeholder"
        justify="center"
        style={style}
      >
        <Icon name="image" />
      </Group>
    );
  }

  // Resolve the element's fit
  const fit = element.fit ?? DefaultImageFit;

  // Render the picture in its box
  return (
    <div
      className={`design-image-element design-image-element-${fit}`}
      style={style}
    >
      <Image className="design-image-element-picture" path={path} alt="" />
    </div>
  );
};
