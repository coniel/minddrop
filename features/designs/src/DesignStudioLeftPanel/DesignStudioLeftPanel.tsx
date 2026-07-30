import { useState } from 'react';
import { i18n } from '@minddrop/i18n';
import {
  IconButton,
  Spacer,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
} from '@minddrop/ui-primitives';
import { AddLayoutMenu } from '../AddLayoutMenu';
import { ElementsPalette } from '../ElementsPalette/ElementsPalette';
import { ElementsTree } from '../ElementsTree';
import './DesignStudioLeftPanel.css';

type ActivePanel = 'elements' | 'layouts';

export interface DesignStudioLeftPanelProps {
  /**
   * Callback fired when the back button is clicked.
   */
  onClickBack?: () => void;
}

export const DesignStudioLeftPanel: React.FC<DesignStudioLeftPanelProps> = ({
  onClickBack,
}) => {
  const [activePanel, setActivePanel] = useState<ActivePanel>('layouts');

  return (
    <Tabs
      className="design-studio-left-panel-content"
      value={activePanel}
      onValueChange={(value) => setActivePanel(value as ActivePanel)}
    >
      <div className="panel-tabs">
        {onClickBack && (
          <IconButton
            icon="arrow-left"
            label="designStudio.backToDesigns"
            tooltip={{ title: 'designStudio.backToDesigns' }}
            color="neutral"
            onClick={onClickBack}
          />
        )}
        <Spacer />
        <TabsList>
          <TabsTab value="elements" size="sm">
            {i18n.t('design-studio.labels.elements')}
          </TabsTab>
          <TabsTab value="layouts" size="sm">
            {i18n.t('design-studio.labels.layouts')}
          </TabsTab>
        </TabsList>
        <Spacer />
        <AddLayoutMenu />
      </div>

      <TabsPanel value="elements">
        <ElementsPalette />
      </TabsPanel>

      <TabsPanel value="layouts">
        <ElementsTree />
      </TabsPanel>
    </Tabs>
  );
};
