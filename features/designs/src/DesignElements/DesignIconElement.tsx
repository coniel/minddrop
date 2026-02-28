import { IconElement, createIconCssStyle } from '@minddrop/designs';
import { ContentIcon, Icon } from '@minddrop/ui-primitives';

export interface DesignIconElementProps {
  /**
   * The icon element to render.
   */
  element: IconElement;
}

/**
 * Pure display renderer for an icon design element.
 * Renders the ContentIcon if an icon is set, otherwise
 * shows a placeholder div with a smile icon.
 */
export const DesignIconElement: React.FC<DesignIconElementProps> = ({
  element,
}) => {
  const cssStyle = createIconCssStyle(element.style);

  // Render the selected icon
  if (element.icon) {
    return (
      <div
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
        }}
      >
        <ContentIcon icon={element.icon} />
      </div>
    );
  }

  // No icon set — show placeholder with smile icon
  return (
    <div
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
        minWidth: 80,
        minHeight: 80,
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
