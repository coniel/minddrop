import { useState } from 'react';
import { useTranslation } from '@minddrop/i18n';
import {
  FloatingToolbar,
  RadioToggleGroup,
  Toggle,
  joinClasses,
} from '@minddrop/ui-primitives';
import { ContentColor, ResolvedThemeVariant, Theme } from '@minddrop/ui-theme';
import { DesignCanvasPane } from '../DesignCanvasPane';
import './DesignPreviewPane.css';

export interface DesignPreviewPaneProps {
  /**
   * The rendered layout's width in pixels.
   */
  width: number;

  /**
   * The scheme hue the render's coloured backgrounds resolve
   * against. The default content colour renders them against the
   * default neutral accent channel, as no scheme at all does.
   */
  scheme?: ContentColor | null;

  /**
   * Toolbars floating at the pane's top right, between the preview
   * settings and the canvas zoom controls, for the design type's
   * own preview options.
   */
  controls?: React.ReactNode;

  /**
   * Toolbars floating ahead of the preview settings, at the left
   * end of the pane's controls, for what the preview renders.
   */
  leadingControls?: React.ReactNode;

  /**
   * The live render of the design.
   */
  children: React.ReactNode;
}

/**
 * Renders the preview side of a design: the live render on a
 * zoomable canvas which refits as the render resizes, with the
 * theme toggles and the canvas zoom controls floating above it.
 * The toggles theme the render alone, leaving the app in its own
 * appearance.
 */
export const DesignPreviewPane: React.FC<DesignPreviewPaneProps> = ({
  width,
  scheme,
  controls,
  leadingControls,
  children,
}) => {
  const [pickedAppearance, setPickedAppearance] =
    useState<ResolvedThemeVariant | null>(null);
  const { t } = useTranslation();
  const variant = Theme.useVariant();

  // The appearance the render is themed in: the picked one, or
  // the app's own while none is picked. The app's follows the OS
  // when its variant is set to system.
  const appearance = pickedAppearance ?? Theme.resolveVariant(variant);

  // The render wrapper's class, carrying the scheme hue when set
  const renderClassName = joinClasses(
    'design-preview-pane-render',
    scheme && scheme !== 'default' ? `scheme-${scheme}` : undefined,
  );

  // Themes the render in the picked appearance
  function handleAppearanceChange(value: string) {
    setPickedAppearance(value === 'dark' ? 'dark' : 'light');
  }

  return (
    <DesignCanvasPane
      className="design-preview-pane"
      layoutWidth={width}
      fitOnResize
      controls={
        <>
          {leadingControls}

          <FloatingToolbar size="md" visible>
            {/* Light/dark theme toggles */}
            <RadioToggleGroup
              size="sm"
              value={appearance}
              onValueChange={handleAppearanceChange}
            >
              <Toggle
                size="sm"
                value="light"
                icon="sun"
                label={t('designsNext.editor.theme.light')}
                tooltip={{ title: 'designsNext.editor.theme.light' }}
              />
              <Toggle
                size="sm"
                value="dark"
                icon="moon"
                label={t('designsNext.editor.theme.dark')}
                tooltip={{ title: 'designsNext.editor.theme.dark' }}
              />
            </RadioToggleGroup>
          </FloatingToolbar>

          {controls}
        </>
      }
    >
      {/* The theme class themes the render alone, so a design can
          be checked in the appearance the app is not in. The
          scheme sits inside it, resolving against its palette. */}
      <div className={`${appearance}-theme`}>
        {/* The scheme class colours the render's schemable
            backgrounds */}
        <div className={renderClassName}>{children}</div>
      </div>
    </DesignCanvasPane>
  );
};
