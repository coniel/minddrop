import {
  AspectRatioToken,
  CardAspectRatios,
  resolveAspectRatioValue,
} from '@minddrop/designs-next';
import { useTranslation } from '@minddrop/i18n';
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  FloatingToolbar,
  ToolbarButton,
} from '@minddrop/ui-primitives';

export interface AspectRatioMenuProps {
  /**
   * The design's aspect ratio, or undefined for auto height.
   */
  aspectRatio?: AspectRatioToken;

  /**
   * Callback fired with the picked ratio, or null for auto height.
   */
  onAspectRatioChange: (aspectRatio: AspectRatioToken | null) => void;
}

// The menu value standing for auto height
const AutoHeight = 'auto';

// The square ratio, offered by name ahead of the others
const SquareAspectRatio: AspectRatioToken = '1/1';

// The portrait and landscape ratios, grouped in the menu
const PortraitAspectRatios = CardAspectRatios.filter(
  (ratio) => resolveAspectRatioValue(ratio) < 1,
);
const LandscapeAspectRatios = CardAspectRatios.filter(
  (ratio) => resolveAspectRatioValue(ratio) > 1,
);

/**
 * Renders the card aspect ratio menu as a floating toolbar: a
 * trigger showing the current choice, opening auto height and
 * square ahead of the portrait and landscape ratios.
 */
export const AspectRatioMenu: React.FC<AspectRatioMenuProps> = ({
  aspectRatio,
  onAspectRatioChange,
}) => {
  const { t } = useTranslation();

  // The menu's selected value
  const value = aspectRatio ?? AutoHeight;

  // Resolves the current choice's display label
  function resolveLabel(): string {
    if (!aspectRatio) {
      return t('designsNext.editor.autoHeight');
    }

    if (aspectRatio === SquareAspectRatio) {
      return t('designsNext.editor.square');
    }

    return formatAspectRatio(aspectRatio);
  }

  // Reports the picked ratio, resolving the menu value to a token
  function handleValueChange(picked: string) {
    onAspectRatioChange(
      CardAspectRatios.find((token) => token === picked) ?? null,
    );
  }

  return (
    <FloatingToolbar size="md" visible>
      <DropdownMenuRoot>
        <DropdownMenuTrigger>
          <ToolbarButton size="sm" variant="subtle" endIcon="chevron-down">
            {resolveLabel()}
          </ToolbarButton>
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuPositioner side="bottom" align="end">
            <DropdownMenuContent minWidth={180}>
              <DropdownMenuRadioGroup
                value={value}
                onValueChange={handleValueChange}
              >
                <DropdownMenuRadioItem
                  value={AutoHeight}
                  label="designsNext.editor.autoHeight"
                />
                <DropdownMenuRadioItem
                  value={SquareAspectRatio}
                  label="designsNext.editor.square"
                />
              </DropdownMenuRadioGroup>
              <DropdownMenuGroup>
                <DropdownMenuLabel label="designsNext.editor.portrait" />
                <DropdownMenuRadioGroup
                  value={value}
                  onValueChange={handleValueChange}
                >
                  {PortraitAspectRatios.map((ratio) => (
                    <DropdownMenuRadioItem
                      key={ratio}
                      value={ratio}
                      stringLabel={formatAspectRatio(ratio)}
                    />
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>
              <DropdownMenuGroup>
                <DropdownMenuLabel label="designsNext.editor.landscape" />
                <DropdownMenuRadioGroup
                  value={value}
                  onValueChange={handleValueChange}
                >
                  {LandscapeAspectRatios.map((ratio) => (
                    <DropdownMenuRadioItem
                      key={ratio}
                      value={ratio}
                      stringLabel={formatAspectRatio(ratio)}
                    />
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenuPositioner>
        </DropdownMenuPortal>
      </DropdownMenuRoot>
    </FloatingToolbar>
  );
};

/**
 * Formats an aspect ratio in the width:height form.
 *
 * @param ratio - The aspect ratio token.
 * @returns The formatted ratio.
 */
function formatAspectRatio(ratio: AspectRatioToken): string {
  return ratio.replace('/', ':');
}
