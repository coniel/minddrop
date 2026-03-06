import { IconElement, createIconCssStyle } from '@minddrop/designs';
import { ContentIcon, Icon } from '@minddrop/ui-primitives';
import { useElementProperty } from '../../DesignPropertiesProvider';

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
 * otherwise falls back to the element's icon or
 * a placeholder with a smile icon.
 */
export const IconDesignElement: React.FC<IconDesignElementProps> = ({
  element,
  rootProps,
}) => {
  const property = useElementProperty(element.id);
  const cssStyle = createIconCssStyle(element.style);
  const rootStyle = rootProps?.style as React.CSSProperties | undefined;

  // Use the mapped property value if available, otherwise the element's icon
  const iconValue =
    property?.value && typeof property.value === 'string'
      ? property.value
      : element.icon;

  // Render the icon
  if (iconValue) {
    return (
      <div
        {...rootProps}
        style={{
          ...cssStyle,
          display: cssStyle.display || 'inline-flex',
          alignItems: cssStyle.alignItems || 'center',
          justifyContent: cssStyle.justifyContent || 'center',
          // Override the default icon size CSS variable and font size
          // so both SVG content icons and emoji scale correctly
          ['--icon-size-default' as string]: `${element.style.size}px`,
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
