import { useCallback } from 'react';
import { PagePanelSide } from '@minddrop/designs';
import { Stack, SwitchField } from '@minddrop/ui-primitives';
import {
  DesignStudioState,
  addPagePanel,
  removePagePanel,
  useDesignStudioStore,
} from '../../DesignStudioStore';
import { SectionLabel } from '../../style-editors/SectionLabel';

/**
 * Renders the page panels section of the page root's style editor:
 * switches to enable a left and/or right panel on the layout.
 */
export const PagePanelsSection: React.FC = () => {
  const hasLeftPanel = useDesignStudioStore((state) => hasPanel(state, 'left'));
  const hasRightPanel = useDesignStudioStore((state) =>
    hasPanel(state, 'right'),
  );

  const handleLeftChange = useCallback((checked: boolean) => {
    if (checked) {
      addPagePanel('left');
    } else {
      removePagePanel('left');
    }
  }, []);

  const handleRightChange = useCallback((checked: boolean) => {
    if (checked) {
      addPagePanel('right');
    } else {
      removePagePanel('right');
    }
  }, []);

  return (
    <Stack gap={3}>
      <SectionLabel label="designs.page-panels.label" />
      <SwitchField
        size="md"
        label="designs.page-panels.left.label"
        checked={hasLeftPanel}
        onCheckedChange={handleLeftChange}
      />
      <SwitchField
        size="md"
        label="designs.page-panels.right.label"
        checked={hasRightPanel}
        onCheckedChange={handleRightChange}
      />
    </Stack>
  );
};

/**
 * Whether the active layout's root has a panel on the given side.
 */
function hasPanel(state: DesignStudioState, side: PagePanelSide): boolean {
  const layoutId = state.activeLayoutId;
  const elements = layoutId ? state.elementsByLayout[layoutId] : undefined;
  const root = elements?.['root'];

  if (!root || !('children' in root) || !elements) {
    return false;
  }

  return root.children.some((childId) => {
    const child = elements[childId];

    return child?.type === 'page-panel' && child.side === side;
  });
}
