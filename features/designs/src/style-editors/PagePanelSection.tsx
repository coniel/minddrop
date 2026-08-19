import { PagePanelSide } from '@minddrop/designs';
import { TranslationKey } from '@minddrop/i18n';
import { NumberField, SwitchField } from '@minddrop/ui-primitives';
import {
  DesignStudioState,
  useDesignStudio,
  useDesignStudioStore,
} from '../DesignStudioStore';
import { PagePanelMaxWidth, PagePanelMinWidth } from '../constants';
import { FlatPagePanelDesignElement } from '../types';
import { StyleSection } from './StyleSection';

export interface PagePanelSectionProps {
  /**
   * The side of the page the section's panel docks to.
   */
  side: PagePanelSide;
}

// The section label per docked side
const SideLabels: Record<PagePanelSide, TranslationKey> = {
  left: 'designsStudio.style.panels.left',
  right: 'designsStudio.style.panels.right',
};

/**
 * Renders one side's panel section of a full-screen root: opening
 * the section docks the panel, clearing it discards the panel
 * along with its contents, and the fields inside hold the page
 * level panel settings.
 */
export const PagePanelSection: React.FC<PagePanelSectionProps> = ({ side }) => {
  const studio = useDesignStudio();

  // The side's panel element, when one is docked
  const panel = useDesignStudioStore((state) => findPanel(state, side));

  // Opening the section is what docks the panel
  function handleOpen() {
    studio.addPagePanel(side);
  }

  // Clearing the section discards the panel and its contents
  function handleClear() {
    studio.removePagePanel(side);
  }

  // Resize the panel, clamped to the same bounds edge-dragging
  // applies
  function handleWidthChange(width: number | null) {
    if (!panel || width === null) {
      return;
    }

    const clamped = Math.min(
      PagePanelMaxWidth,
      Math.max(PagePanelMinWidth, width),
    );

    studio.setDesignElement(panel.id, { ...panel, width: clamped });
  }

  // The open default is stored as an unset key, so switching it
  // back on removes the key rather than storing a true
  function handleDefaultOpenChange(checked: boolean) {
    if (!panel) {
      return;
    }

    if (checked) {
      // Drop the key by replacing the element, since a merge
      // cannot unset a field
      const { defaultOpen: _removed, ...openPanel } = panel;

      studio.setDesignElement(panel.id, openPanel);
    } else {
      studio.setDesignElement(panel.id, { ...panel, defaultOpen: false });
    }
  }

  return (
    <StyleSection
      label={SideLabels[side]}
      keys={[]}
      hasCustomValues={Boolean(panel)}
      getValue={() => undefined}
      setValue={() => undefined}
      onOpen={handleOpen}
      onClear={handleClear}
    >
      <NumberField
        variant="subtle"
        size="md"
        label="designsStudio.style.panels.width"
        min={PagePanelMinWidth}
        max={PagePanelMaxWidth}
        value={panel?.width ?? null}
        onValueChange={handleWidthChange}
      />
      <SwitchField
        size="md"
        label="designsStudio.style.panels.defaultOpen"
        checked={panel ? (panel.defaultOpen ?? true) : true}
        onCheckedChange={handleDefaultOpenChange}
      />
    </StyleSection>
  );
};

/**
 * Finds the panel docked to the given side of the active layout's
 * root, or null when the side has none.
 */
function findPanel(
  state: DesignStudioState,
  side: PagePanelSide,
): FlatPagePanelDesignElement | null {
  // The active layout's flattened elements
  const layoutId = state.activeLayoutId;
  const elements = layoutId ? state.elementsByLayout[layoutId] : undefined;
  const root = elements?.root;

  // No active layout, or its root is missing
  if (!elements || !root || !('children' in root)) {
    return null;
  }

  // Look for a panel child docked to the side
  for (const childId of root.children) {
    const child = elements[childId];

    if (child?.type === 'page-panel' && child.side === side) {
      return child as FlatPagePanelDesignElement;
    }
  }

  return null;
}
