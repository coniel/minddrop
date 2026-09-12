import { DesignElementProps, Designs } from '@minddrop/designs-next';
import {
  resolveElementColor,
  resolveFontLetterBand,
  resolveTextSettingsClass,
  resolveThemeFontStack,
  useElementValue,
} from '@minddrop/ui-designs-next';
import { joinClasses } from '@minddrop/ui-primitives';
import { HeadingElement } from '../HeadingElement.types';
import { resolveHeadingTextStyle } from '../resolveHeadingTextStyle';
import './HeadingElementRenderer.css';

/**
 * The custom property holding the font headings are drawn in.
 */
const HeadingFontProperty = '--font-ui';

/**
 * The weight headings are measured at, matching the stylesheet's
 * base weight. Bold and italic headings are measured at it too:
 * their heavier and slanted letters reach a little further, and
 * sizing to that would resize the text as they are turned on.
 */
const HeadingFontWeight = 600;

/**
 * Renders the heading element as prominent text, taking it from the
 * property the element maps to and falling back to its own content.
 * The block's height sizes the text, holding it from the top of its
 * tallest letters to the bottom of its lowest: headings which may
 * not grow past their block hold a single line, ones which may wrap
 * into a line per block height.
 */
export const HeadingElementRenderer: React.FC<
  DesignElementProps<HeadingElement>
> = ({ element }) => {
  const propertyValue = useElementValue(element);

  // The block's height in pixels, which a line of letters fills
  const blockHeight = element.rowSpan * Designs.constants.UnitPixelSize;

  // The band the letters of the font the heading is drawn in occupy
  const band = resolveFontLetterBand({
    fontFamily: resolveThemeFontStack(HeadingFontProperty),
    fontWeight: HeadingFontWeight,
  });

  // Whether the heading may grow past its block
  const contentFit = element.contentFit ?? 'fixed';
  const grows = contentFit === 'grow' || contentFit === 'natural';

  // The single line and text settings modifier classes
  const textClassName = joinClasses(
    'design-heading-element-text',
    !grows && 'design-heading-element-single-line',
    resolveTextSettingsClass(element),
  );

  // The text fitted to its block, set in the weight and colour it
  // is given. The band is measured at the base weight either way,
  // so setting a weight does not resize the text.
  const style: React.CSSProperties = {
    ...resolveHeadingTextStyle(blockHeight, band),
    fontWeight: element.fontWeight,
    color: resolveElementColor(element.textColor),
  };

  return (
    <div className="design-heading-element">
      <span className={textClassName} style={style}>
        {propertyValue ?? element.content}
      </span>
    </div>
  );
};
