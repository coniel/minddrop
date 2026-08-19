import { CSSProperties } from 'react';
import {
  IconElement,
  IconStyle,
  createIconContainerCss,
  resolveElementStyle,
  tokenCssVariable,
} from '@minddrop/designs';
import { ContentIcon, Icon } from '@minddrop/ui-primitives';
import { useElementProperty } from '../../DesignPropertiesProvider';
import { useLayoutType } from '../../LayoutTypeContext';
import { useElementPlaceholderIcon } from '../../useElementPlaceholder';
import '../elementPlaceholder.css';
import './IconDesignElement.css';
import { useElementCssStyle } from '../../useElementCssStyle';

export interface IconDesignElementProps {
  /**
   * The icon element to render.
   */
  element: IconElement;
}

/**
 * Display renderer for an icon design element.
 * Shows the mapped property icon when available, otherwise falls
 * back to the resolved placeholder icon or a placeholder box with
 * a smile icon. When the style defines a container, the icon is
 * wrapped in the container box.
 */
export const IconDesignElement: React.FC<IconDesignElementProps> = ({
  element,
}) => {
  const property = useElementProperty(element.id);
  const placeholderIcon = useElementPlaceholderIcon(element, element.icon);
  // The surrounding layout's type, which role styles resolve against
  const layoutType = useLayoutType();
  // Resolve the element's style with its role styles applied
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

  // Use the mapped property value if available, otherwise the placeholder
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
