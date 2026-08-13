import { useState } from 'react';
import { TranslationKey, i18n } from '@minddrop/i18n';
import {
  IconButton,
  IconButtonSpacer,
  Spacer,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
} from '@minddrop/ui-primitives';
import { ElementsPalette } from '../ElementsPalette/ElementsPalette';
import { ElementsTree } from '../ElementsTree';
import { ViewsPanel } from '../ViewsPanel';
import './LayoutEditorLeftPanel.css';

type ActivePanel = 'layout' | 'elements' | 'views';

export interface LayoutEditorLeftPanelProps {
  /**
   * The label of the back button.
   * @default 'actions.back'
   */
  backButtonLabel?: TranslationKey;

  /**
   * Callback fired when the back button is clicked. The button
   * is only rendered when provided.
   */
  onClickBack?: () => void;

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
 * tab, an elements palette tab, and a views tab.
 */
export const LayoutEditorLeftPanel: React.FC<LayoutEditorLeftPanelProps> = ({
  backButtonLabel = 'actions.back',
  onClickBack,
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
        {onClickBack && (
          <IconButton
            icon="arrow-left"
            label={backButtonLabel}
            tooltip={{ title: backButtonLabel }}
            color="neutral"
            onClick={onClickBack}
          />
        )}
        <Spacer />
        <TabsList>
          <TabsTab value="layout" size="sm">
            {i18n.t('design-studio.labels.layout')}
          </TabsTab>
          <TabsTab value="elements" size="sm">
            {i18n.t('design-studio.labels.elements')}
          </TabsTab>
          <TabsTab value="views" size="sm">
            {i18n.t('design-studio.labels.views')}
          </TabsTab>
        </TabsList>
        <Spacer />
        {/* Balance the back button so the tabs stay centred */}
        {onClickBack && <IconButtonSpacer />}
      </div>

      <TabsPanel value="layout">
        <ElementsTree />
      </TabsPanel>

      <TabsPanel value="elements">
        <ElementsPalette elementTypes={elementTypes} showViews={showViews} />
      </TabsPanel>

      <TabsPanel value="views">
        <ViewsPanel />
      </TabsPanel>
    </Tabs>
  );
};
