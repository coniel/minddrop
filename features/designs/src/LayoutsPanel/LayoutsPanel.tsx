import {
  MenuGroup,
  MenuLabel,
  ScrollArea,
  Separator,
} from '@minddrop/ui-primitives';
import { useActiveLayout } from '../DesignStudioStore';
import { ElementsPalette } from '../ElementsPalette';
import { ElementsTree } from '../ElementsTree';
import { LayoutsPalette } from '../LayoutsPalette';
import { DesignLayoutsList } from './DesignLayoutsList';
import { RootAppendZone } from './RootAppendZone';
import './LayoutsPanel.css';

/**
 * Renders the studio's layouts panel: the design's layouts and the
 * layout types it can add while no layout is being edited, and the
 * active layout's element tree and elements palette while one is.
 */
export const LayoutsPanel: React.FC = () => {
  const layout = useActiveLayout();

  // No layout is being edited: offer new layouts and the design's
  // existing ones
  if (!layout) {
    return (
      <ScrollArea stateKey="layouts-panel-scroll">
        <div className="designs-layouts-panel">
          <MenuGroup marginTop="small">
            <DesignLayoutsList />
          </MenuGroup>
          <MenuGroup>
            <MenuLabel label="designsStudio.layouts.new" />
            <LayoutsPalette />
          </MenuGroup>
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea stateKey="layout-editor-scroll">
      <div className="designs-layouts-panel designs-layouts-panel-editor">
        <ElementsTree />
        {/** Everything below the tree doubles as a drop target
         * appending elements to the end of the layout root **/}
        <RootAppendZone>
          <Separator />
          <ElementsPalette />
        </RootAppendZone>
      </div>
    </ScrollArea>
  );
};
