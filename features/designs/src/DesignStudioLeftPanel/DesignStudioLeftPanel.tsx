import { useState } from 'react';
import { generatePropertyPlaceholder } from '@minddrop/designs';
import { PropertyTypeSelectionMenu } from '@minddrop/feature-properties';
import { TranslationKey, i18n } from '@minddrop/i18n';
import { PropertySchemaTemplate } from '@minddrop/properties';
import {
  IconButton,
  IconButtonSpacer,
  Spacer,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
} from '@minddrop/ui-primitives';
import { AddLayoutMenu } from '../AddLayoutMenu';
import {
  DesignPropertiesPanel,
  DraftDesignProperty,
} from '../DesignPropertiesPanel';
import { useDesignStudioStore } from '../DesignStudioStore';
import { ElementsPalette } from '../ElementsPalette/ElementsPalette';
import { ElementsTree } from '../ElementsTree';
import './DesignStudioLeftPanel.css';

type ActivePanel = 'elements' | 'layouts' | 'properties';

export interface DesignStudioLeftPanelProps {
  /**
   * The label to display on the back button.
   * @default 'designStudio.backToDesigns'
   */
  backButtonLabel?: TranslationKey;

  /**
   * Callback fired when the back button is clicked.
   */
  onClickBack?: () => void;
}

export const DesignStudioLeftPanel: React.FC<DesignStudioLeftPanelProps> = ({
  backButtonLabel = 'designStudio.backToDesigns',
  onClickBack,
}) => {
  const [activePanel, setActivePanel] = useState<ActivePanel>('layouts');
  const [draftProperties, setDraftProperties] = useState<DraftDesignProperty[]>(
    [],
  );
  const designProperties = useDesignStudioStore(
    (state) => state.design?.properties || [],
  );

  // Add a draft property from the selected template with a
  // generated placeholder
  function handleAddProperty(template: PropertySchemaTemplate) {
    const draftProperty = {
      ...template,
      name: i18n.t(template.name),
      placeholder: generatePropertyPlaceholder(template.type),
      id: Date.now(),
    } as DraftDesignProperty;

    setDraftProperties((previousDrafts) => [...previousDrafts, draftProperty]);
  }

  // Remove a draft property by its ID
  function removeDraftProperty(id: number) {
    setDraftProperties((previousDrafts) =>
      previousDrafts.filter((draft) => draft.id !== id),
    );
  }

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
            label={backButtonLabel}
            tooltip={{ title: backButtonLabel }}
            color="neutral"
            onClick={onClickBack}
          />
        )}
        <Spacer />
        <TabsList>
          <TabsTab value="properties" size="sm">
            {i18n.t('design-studio.labels.properties')}
          </TabsTab>
          <TabsTab value="layouts" size="sm">
            {i18n.t('design-studio.labels.layouts')}
          </TabsTab>
          <TabsTab value="elements" size="sm">
            {i18n.t('design-studio.labels.elements')}
          </TabsTab>
        </TabsList>
        <Spacer />
        {activePanel === 'layouts' && <AddLayoutMenu />}
        {activePanel === 'properties' && (
          <PropertyTypeSelectionMenu
            existingProperties={[...designProperties, ...draftProperties]}
            onSelect={handleAddProperty}
          >
            <IconButton
              size="sm"
              label="designs.properties.actions.add"
              icon="plus"
            />
          </PropertyTypeSelectionMenu>
        )}
        {activePanel === 'elements' && <IconButtonSpacer size="sm" />}
      </div>

      <TabsPanel value="properties">
        <DesignPropertiesPanel
          draftProperties={draftProperties}
          onSaveDraft={removeDraftProperty}
          onCancelDraft={removeDraftProperty}
        />
      </TabsPanel>

      <TabsPanel value="layouts">
        <ElementsTree />
      </TabsPanel>

      <TabsPanel value="elements">
        <ElementsPalette />
      </TabsPanel>
    </Tabs>
  );
};
