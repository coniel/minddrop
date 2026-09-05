import { useState } from 'react';
import { createI18nKeyBuilder } from '@minddrop/i18n';
import {
  DropdownMenuColorSelectionItem,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  FloatingToolbar,
  ToolbarButton,
  ToolbarIconButton,
  joinClasses,
} from '@minddrop/ui-primitives';
import { ContentColor, ContentColors, Theme } from '@minddrop/ui-theme';
import { DesignCanvasPane } from '../DesignCanvasPane';
import './DesignPreviewPane.css';

export interface DesignPreviewPaneProps {
  /**
   * The rendered layout's width in pixels.
   */
  width: number;

  /**
   * Toolbars floating at the pane's top right, between the preview
   * settings and the canvas zoom controls, for the design type's
   * own preview options.
   */
  controls?: React.ReactNode;

  /**
   * The live render of the design.
   */
  children: React.ReactNode;
}

// Builds the label key of a content colour
const colorLabelKey = createI18nKeyBuilder('color.');

/**
 * Renders the preview side of a design: the live render on a
 * zoomable canvas which refits as the render resizes, with the
 * theme toggle, the scheme picker and the canvas zoom controls
 * floating above it.
 */
export const DesignPreviewPane: React.FC<DesignPreviewPaneProps> = ({
  width,
  controls,
  children,
}) => {
  const [scheme, setScheme] = useState<ContentColor | null>(null);
  const variant = Theme.useVariant();

  // The appearance the theme variant resolves to, following the OS
  // when set to system
  const appearance = Theme.resolveVariant(variant);

  // The colour the scheme trigger previews: no scheme reads as the
  // default content colour
  const selectedColor = scheme ?? 'default';

  // The render wrapper's class, carrying the scheme hue when set
  const renderClassName = joinClasses(
    'design-preview-pane-render',
    scheme ? `scheme-${scheme}` : undefined,
  );

  // Switches the app theme to the opposite appearance
  function handleToggleDarkMode() {
    Theme.setVariant(appearance === 'dark' ? 'light' : 'dark');
  }

  // Changes the scheme hue the render's coloured backgrounds render
  // with. The default content colour clears the scheme so they
  // render against the default neutral accent channel.
  function handleSchemeChange(color: ContentColor) {
    setScheme(color === 'default' ? null : color);
  }

  return (
    <DesignCanvasPane
      className="design-preview-pane"
      layoutWidth={width}
      fitOnResize
      controls={
        <>
          <FloatingToolbar size="md" visible>
            {/* Light/dark theme toggle */}
            <ToolbarIconButton
              icon={appearance === 'dark' ? 'sun' : 'moon'}
              label="designsNext.editor.toggleTheme"
              tooltip={{ title: 'designsNext.editor.toggleTheme' }}
              variant="subtle"
              size="sm"
              onClick={handleToggleDarkMode}
            />

            {/* Preview scheme picker */}
            <DropdownMenuRoot>
              <DropdownMenuTrigger>
                <ToolbarButton
                  size="sm"
                  variant="subtle"
                  className="design-preview-pane-scheme-trigger"
                  label={colorLabelKey(selectedColor)}
                  startIcon={
                    <div
                      className={`color-swatch color-swatch-${selectedColor}`}
                    />
                  }
                  endIcon="chevron-down"
                />
              </DropdownMenuTrigger>
              <DropdownMenuPortal>
                <DropdownMenuPositioner side="bottom" align="start">
                  <DropdownMenuContent minWidth={140}>
                    {ContentColors.map((color) => (
                      <DropdownMenuColorSelectionItem
                        key={color}
                        color={color}
                        checked={color === selectedColor}
                        onClick={() => handleSchemeChange(color)}
                      />
                    ))}
                  </DropdownMenuContent>
                </DropdownMenuPositioner>
              </DropdownMenuPortal>
            </DropdownMenuRoot>
          </FloatingToolbar>

          {controls}
        </>
      }
    >
      {/* The scheme class colours the render's schemable backgrounds */}
      <div className={renderClassName}>{children}</div>
    </DesignCanvasPane>
  );
};
