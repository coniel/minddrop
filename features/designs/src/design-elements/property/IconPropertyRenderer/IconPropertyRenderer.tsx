import { CSSProperties } from 'react';
import {
  IconPropertyElement,
  IconStyle,
  createIconContainerCss,
  resolveElementStyle,
  tokenCssVariable,
} from '@minddrop/designs';
import { ContentIcon, Icon } from '@minddrop/ui-primitives';
import { useElementProperty } from '../../../DesignPropertiesProvider';
import { useLayoutType } from '../../../LayoutTypeContext';
import { useElementCssStyle } from '../../../useElementCssStyle';
import { useElementPlaceholderIcon } from '../../../useElementPlaceholder';
import '../../elementPlaceholder.css';
import './IconPropertyRenderer.css';

export interface IconPropertyRendererProps {
  /**
   * The icon property element to render.
   */
  element: IconPropertyElement;
}

/**
 * Display renderer for an icon property element. Shows the bound
 * property icon when available, otherwise falls back to the
 * resolved placeholder icon or a placeholder box with a smile
 * icon. When the style defines a box, the icon is wrapped in it.
 */
export const IconPropertyRenderer: React.FC<IconPropertyRendererProps> = ({
  element,
}) => {
  const property = useElementProperty(element.id);
  const placeholderIcon = useElementPlaceholderIcon(element);
  // The surrounding layout's type, which theme styles resolve against
  const layoutType = useLayoutType();
  // Resolve the element's style with its variant theme styles applied
  const style: IconStyle = resolveElementStyle(
    element,
    layoutType ?? undefined,
  );
  const cssStyle = useElementCssStyle(element);

  // The container box CSS, null when the style has no container
  const containerCss = createIconContainerCss(style);

  // Split the margins off the icon CSS so they can move to the
  // container box when one is rendered
  const { marginTop, marginRight, marginBottom, marginLeft, ...iconCss } =
    cssStyle;
  const marginCss = { marginTop, marginRight, marginBottom, marginLeft };

  // Use the bound property value if available, otherwise the placeholder
  const iconValue =
    property?.value && typeof property.value === 'string'
      ? property.value
      : placeholderIcon;

  // No icon set - show placeholder with smile icon
  if (!iconValue) {
    return (
      <div
        className="designs-element-placeholder"
        style={{
          ...cssStyle,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--space-2)',
          padding: 'var(--space-4)',
          borderRadius: 'var(--radius-sm)',
        }}
      >
        <Icon name="smile" size={24} style={{ flexShrink: 0 }} />
      </div>
    );
  }

  // The icon node, sized by the icon size token. The font size
  // scales emoji icons to match SVG icon sizing.
  const iconNode = (
    <div
      className="designs-icon-element"
      style={{
        ...(containerCss ? iconCss : cssStyle),
        ...(style.size && {
          fontSize: tokenCssVariable('iconSize', style.size),
        }),
        lineHeight: 1,
      }}
    >
      <ContentIcon icon={iconValue} />
    </div>
  );

  // Bare icon without a container box
  if (!containerCss) {
    return iconNode;
  }

  // Wrap the icon in its container box, moving the margins onto it
  const containerStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...containerCss,
    ...marginCss,
  };

  return (
    <div className="designs-icon-element-container" style={containerStyle}>
      {iconNode}
    </div>
  );
};
