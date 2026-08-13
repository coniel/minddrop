import { IconElement, createIconCssStyle } from '@minddrop/designs-legacy';
import { ContentIcon, Icon } from '@minddrop/ui-primitives';
import { useElementProperty } from '../../DesignPropertiesProvider';
import { useElementPlaceholderIcon } from '../../useElementPlaceholder';

export interface IconDesignElementProps {
  /**
   * The icon element to render.
   */
  element: IconElement;

  /**
   * Optional props to spread on the root DOM element.
   */
  rootProps?: Record<string, unknown>;
}

/**
 * Display renderer for an icon design element.
 * Shows the mapped property icon when available,
 * otherwise falls back to the resolved placeholder
 * icon or a placeholder box with a smile icon.
 */
export const IconDesignElement: React.FC<IconDesignElementProps> = ({
  element,
  rootProps,
}) => {
  const property = useElementProperty(element.id);
  const placeholderIcon = useElementPlaceholderIcon(element, element.icon);
  const cssStyle = createIconCssStyle(element.style);
  const rootStyle = rootProps?.style as React.CSSProperties | undefined;

  // Use the mapped property value if available, otherwise the placeholder
  const iconValue =
    property?.value && typeof property.value === 'string'
      ? property.value
      : placeholderIcon;

  // Render the icon
  if (iconValue) {
    return (
      <div
        {...rootProps}
        style={{
          ...cssStyle,
          // Override the default icon size CSS variable and font size
          // so both SVG content icons and emoji scale correctly
          ['--icon-size-md' as string]: `${element.style.size}px`,
          fontSize: `${element.style.size}px`,
          lineHeight: 1,
          ...rootStyle,
        }}
      >
        <ContentIcon icon={iconValue} />
      </div>
    );
  }

  // No icon set - show placeholder with smile icon
  return (
    <div
      {...rootProps}
      style={{
        ...cssStyle,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-2)',
        padding: 'var(--space-4)',
        backgroundColor: cssStyle.backgroundColor || 'var(--neutral-400)',
        borderRadius: cssStyle.borderRadius || 'var(--space-1)',
        ...rootStyle,
      }}
    >
      <Icon
        name="smile"
        size={24}
        style={{ color: 'var(--contrast-500)', flexShrink: 0 }}
      />
    </div>
  );
};
