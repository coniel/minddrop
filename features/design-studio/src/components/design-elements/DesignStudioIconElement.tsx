import { useCallback } from 'react';
import { createIconCssStyle } from '@minddrop/designs';
import { useTranslation } from '@minddrop/i18n';
import { ContentIcon, Icon, IconPicker } from '@minddrop/ui-primitives';
import {
  updateDesignElement,
  updateElementStyle,
} from '../../DesignStudioStore';
import { FlatIconElement } from '../../types';

export interface DesignStudioIconElementProps {
  element: FlatIconElement;
}

export const DesignStudioIconElement: React.FC<
  DesignStudioIconElementProps
> = ({ element }) => {
  const { t } = useTranslation();
  const cssStyle = createIconCssStyle(element.style);

  // Handles selecting an icon from the picker, syncing the
  // color from the icon string into the style color field
  const handleSelect = useCallback(
    (iconString: string) => {
      updateDesignElement(element.id, { icon: iconString });

      // Extract color from content-icon string (e.g. "content-icon:cat:cyan")
      const parts = iconString.split(':');

      if (parts[0] === 'content-icon' && parts[2]) {
        updateElementStyle(element.id, 'color', parts[2]);
      }
    },
    [element.id],
  );

  // Render selected icon with picker on click
  if (element.icon) {
    return (
      <IconPicker
        currentIcon={element.icon}
        onSelect={handleSelect}
        closeOnSelect
      >
        <div
          style={{
            ...cssStyle,
            display: cssStyle.display || 'inline-flex',
            alignItems: cssStyle.alignItems || 'center',
            justifyContent: cssStyle.justifyContent || 'center',
            // Override the default icon size CSS variable and font size
            // so both SVG content icons and emoji scale correctly
            ['--icon-size-default' as any]: `${element.style.size}px`,
            fontSize: `${element.style.size}px`,
            lineHeight: 1,
          }}
        >
          <ContentIcon icon={element.icon} />
        </div>
      </IconPicker>
    );
  }

  // Placeholder state — no icon selected yet
  return (
    <IconPicker onSelect={handleSelect} closeOnSelect>
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
        <span
          style={{
            color: 'var(--contrast-500)',
            fontSize: 'var(--text-xs)',
            textAlign: 'center',
          }}
        >
          {t('designs.icon.placeholder.hint')}
        </span>
      </div>
    </IconPicker>
  );
};
