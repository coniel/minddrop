import { useState } from 'react';
import { i18n } from '@minddrop/i18n';
import {
  Spacer,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
} from '@minddrop/ui-primitives';
import { ElementsPalette } from '../ElementsPalette/ElementsPalette';
import { ElementsTree } from '../ElementsTree';
import './LayoutEditorLeftPanel.css';

type ActivePanel = 'layout' | 'elements';

export interface LayoutEditorLeftPanelProps {
  /**
   * When provided, only these element types are shown in the
   * elements palette.
   */
  elementTypes?: string[];

  /**
   * Whether to show the views group in the elements palette.
   * @default true
   */
  showViews?: boolean;
}

/**
 * Renders the layout editor's side panel: a layout element tree
 * tab and an elements palette tab.
 */
export const LayoutEditorLeftPanel: React.FC<LayoutEditorLeftPanelProps> = ({
  elementTypes,
  showViews,
}) => {
  const [activePanel, setActivePanel] = useState<ActivePanel>('layout');

  return (
    <Tabs
      className="layout-editor-left-panel"
      value={activePanel}
      onValueChange={(value) => setActivePanel(value as ActivePanel)}
    >
      <div className="panel-tabs">
        <Spacer />
        <TabsList>
          <TabsTab value="layout" size="sm">
            {i18n.t('design-studio.labels.layout')}
          </TabsTab>
          <TabsTab value="elements" size="sm">
            {i18n.t('design-studio.labels.elements')}
          </TabsTab>
        </TabsList>
        <Spacer />
      </div>

      <TabsPanel value="layout">
        <ElementsTree />
      </TabsPanel>

      <TabsPanel value="elements">
        <ElementsPalette elementTypes={elementTypes} showViews={showViews} />
      </TabsPanel>
    </Tabs>
  );
};
