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
} from '@minddrop/ui-primitives';
import { ContentColors, Theme } from '@minddrop/ui-theme';
import { useDesignStudioPreview } from '../DesignStudioPreviewContext';
import './DesignStudioPreviewToolbar.css';

const colorLabelKey = createI18nKeyBuilder('color.');

/**
 * Renders the studio's preview controls: a dropdown picking the
 * scheme hue coloured backgrounds render with, and a toggle
 * switching the app between the light and dark themes.
 */
export const DesignStudioPreviewToolbar: React.FC = () => {
  const { scheme, setScheme } = useDesignStudioPreview();
  const variant = Theme.useVariant();

  // The colour the trigger previews: no scheme reads as the
  // default content colour
  const selectedColor = scheme ?? 'default';

  // The appearance the variant resolves to, following the OS when
  // set to system
  const appearance = Theme.resolveVariant(variant);

  // Switch the app theme to the opposite appearance
  function handleToggleDarkMode() {
    Theme.setVariant(appearance === 'dark' ? 'light' : 'dark');
  }

  return (
    <FloatingToolbar size="md" visible>
      {/** Light/dark theme toggle **/}
      <ToolbarIconButton
        icon={appearance === 'dark' ? 'sun' : 'moon'}
        label="designsStudio.preview.toggleTheme"
        tooltip={{ title: 'designsStudio.preview.toggleTheme' }}
        variant="subtle"
        size="sm"
        onClick={handleToggleDarkMode}
      />

      {/** Preview scheme picker **/}
      <DropdownMenuRoot>
        <DropdownMenuTrigger>
          <ToolbarButton
            size="sm"
            variant="subtle"
            className="designs-studio-preview-scheme-trigger"
            label={colorLabelKey(selectedColor)}
            startIcon={
              <div className={`color-swatch color-swatch-${selectedColor}`} />
            }
            endIcon="chevron-down"
          />
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuPositioner side="bottom" align="start">
            <DropdownMenuContent minWidth={140}>
              {/** The default content colour clears the scheme so
               * coloured backgrounds render against the default
               * neutral accent channel **/}
              {ContentColors.map((color) => (
                <DropdownMenuColorSelectionItem
                  key={color}
                  color={color}
                  onClick={() => setScheme(color === 'default' ? null : color)}
                />
              ))}
            </DropdownMenuContent>
          </DropdownMenuPositioner>
        </DropdownMenuPortal>
      </DropdownMenuRoot>
    </FloatingToolbar>
  );
};
