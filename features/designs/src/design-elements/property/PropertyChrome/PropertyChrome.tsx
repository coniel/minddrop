import {
  PropertyChromeStyles,
  PropertyElement,
  PropertyElementConfig,
  createPropertyIconCss,
  createPropertyLabelCss,
  getPropertyElementConfig,
  resolveElementStyle,
  supportsPropertyChrome,
} from '@minddrop/designs';
import { TranslationKey, useTranslation } from '@minddrop/i18n';
import { ContentIcon, Icon } from '@minddrop/ui-primitives';
import { useDesignPreview } from '../../../DesignElements';
import {
  useDesignProperties,
  useElementProperty,
} from '../../../DesignPropertiesProvider';
import { useLayoutType } from '../../../LayoutTypeContext';
import { PropertyChromeProvider } from '../../../PropertyChromeContext';
import { useElementCssStyle } from '../../../useElementCssStyle';
import './PropertyChrome.css';

export interface PropertyChromeProps {
  /**
   * The property element the chrome renders around.
   */
  element: PropertyElement;

  /**
   * The element's value renderer.
   */
  children: React.ReactNode;
}

/**
 * Renders the property chrome around a property element's value:
 * the bound property's name label and icon, each beside or above
 * the value per its position. Renders the value alone when the
 * element's style enables neither, or its variant's style category
 * carries no chrome.
 */
export const PropertyChrome: React.FC<PropertyChromeProps> = ({
  element,
  children,
}) => {
  const { t } = useTranslation();
  const preview = useDesignPreview();
  const entryContext = useDesignProperties();
  const property = useElementProperty(element.id);
  // The surrounding layout's type, which theme styles resolve
  // against
  const layoutType = useLayoutType();
  // The full element CSS, from which the wrapper takes the margins
  const elementCss = useElementCssStyle(element);

  // The chrome styles resolve with the variant theme styles
  // applied; only value-like style shapes carry the chrome keys
  const style = resolveElementStyle(
    element,
    layoutType ?? undefined,
  ) as PropertyChromeStyles;
  const { label, icon } = style;
  const config = getPropertyElementConfig(element.propertyType, false);

  // Nothing enabled, an unconfigured property type, or a variant
  // outside the value-like categories: render the value alone
  if ((!label && !icon) || !config || !supportsPropertyChrome(element)) {
    return <>{children}</>;
  }

  // Whether real entry data is being rendered, where unbound
  // chrome has no property to represent
  const isEntryRendering = Boolean(entryContext) && !preview;

  // The chrome content, null when unresolvable
  const labelText = resolveLabelText(element, config, isEntryRendering, t);
  const iconGlyph = resolveIconGlyph(
    element,
    config,
    property?.schema.icon,
    isEntryRendering,
  );

  // The selected chrome variants, at their defaults while unset
  const labelVariant = label?.variant ?? 'above';
  const iconVariant = icon?.variant ?? 'side';

  // The chrome nodes, absent when disabled or unresolvable
  const labelNode = label && labelText && (
    <span
      className="designs-property-chrome-label"
      style={createPropertyLabelCss(label)}
    >
      {labelText}
    </span>
  );
  const iconNode = icon && iconGlyph && (
    <span
      className="designs-property-chrome-icon"
      style={createPropertyIconCss(icon)}
    >
      {iconGlyph}
    </span>
  );

  // The above variants stack over the value; side and spread sit
  // in the value row
  const labelAbove = labelVariant === 'above';
  const iconAbove = iconVariant === 'above';
  const aboveIcon = iconAbove ? iconNode : null;
  const aboveLabel = labelAbove ? labelNode : null;
  const sideIcon = iconAbove ? null : iconNode;
  const sideLabel = labelAbove ? null : labelNode;

  // The spread variant pushes the value to the row's far side
  const rowClassName =
    labelVariant === 'spread'
      ? 'designs-property-chrome-row designs-property-chrome-row-spread'
      : 'designs-property-chrome-row';

  // The wrapper owns the element margins; the value renderer drops
  // them through the chrome context
  const { marginTop, marginRight, marginBottom, marginLeft } = elementCss;

  return (
    <div
      className="designs-property-chrome"
      style={{ marginTop, marginRight, marginBottom, marginLeft }}
    >
      {/** The chrome row above the value **/}
      {(aboveIcon || aboveLabel) && (
        <div className="designs-property-chrome-group">
          {aboveIcon}
          {aboveLabel}
        </div>
      )}

      {/** The value row, with side-positioned chrome beside it **/}
      <div className={rowClassName}>
        {sideIcon}
        {sideLabel}
        <PropertyChromeProvider value={true}>{children}</PropertyChromeProvider>
      </div>
    </div>
  );
};

/**
 * Resolves the label's text: the bound property's name, so renames
 * flow through. Unbound elements fall back to the property type
 * label as a design-time stand-in, and render no label during
 * entry rendering, where the stand-in would read as content.
 */
function resolveLabelText(
  element: PropertyElement,
  config: PropertyElementConfig,
  isEntryRendering: boolean,
  t: (key: TranslationKey) => string,
): string | null {
  // The binding name is the property name itself
  if (element.property) {
    return element.property;
  }

  // Unbound during entry rendering: nothing to represent
  if (isEntryRendering) {
    return null;
  }

  return t(config.label);
}

/**
 * Resolves the icon glyph: the bound property's own icon, falling
 * back to the property type's icon. Unbound elements render no
 * icon during entry rendering.
 */
function resolveIconGlyph(
  element: PropertyElement,
  config: PropertyElementConfig,
  propertyIcon: string | undefined,
  isEntryRendering: boolean,
): React.ReactNode | null {
  // Unbound during entry rendering: nothing to represent
  if (!element.property && isEntryRendering) {
    return null;
  }

  // The bound property's own icon
  if (propertyIcon) {
    return <ContentIcon icon={propertyIcon} />;
  }

  return <Icon name={config.icon} />;
}
