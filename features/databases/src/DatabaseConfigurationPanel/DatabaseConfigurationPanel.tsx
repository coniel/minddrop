import { useState } from 'react';
import { Databases } from '@minddrop/databases';
import { PropertyTypeSelectionMenu } from '@minddrop/feature-properties';
import { i18n } from '@minddrop/i18n';
import { PropertySchemaTemplate } from '@minddrop/properties';
import {
  IconButton,
  IconButtonSpacer,
  Panel,
  Spacer,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  VerticalScrollArea,
  useTransientState,
} from '@minddrop/ui-primitives';
import { DatabaseDesignPanel } from '../DatabaseDesignPanel';
import {
  DatabaseEntryTemplatesEditor,
  DraftEntryTemplate,
} from '../DatabaseEntryTemplatesEditor';
import {
  DatabasePropertiesEditor,
  DraftProperty,
} from '../DatabasePropertiesEditor';
import { DatabaseSettingsPanel } from '../DatabaseSettingsPanel';
import './DatabaseConfigurationPanel.css';

export type ConfigPanelTab =
  | 'properties'
  | 'designs'
  | 'templates'
  | 'settings';

export interface DatabaseConfigurationPanelProps {
  /**
   * The database ID.
   */
  databaseId: string;
}

/**
 * Renders the database configuration panel with tabbed
 * Properties, Designs, Templates, and Settings sections.
 */
export const DatabaseConfigurationPanel: React.FC<
  DatabaseConfigurationPanelProps
> = ({ databaseId }) => {
  // The active tab, remembered with the view's session
  const [activeTab, setActiveTab] = useTransientState<ConfigPanelTab>(
    'configPanelTab',
    'properties',
  );
  const [draftProperties, setDraftProperties] = useState<DraftProperty[]>([]);
  const [draftTemplates, setDraftTemplates] = useState<DraftEntryTemplate[]>(
    [],
  );
  const databaseConfig = Databases.use(databaseId);

  // Settings is a tab value so it survives remounts (e.g. rename)
  const showSettings = activeTab === 'settings';

  // Add a new draft property from the type selection menu
  function handleAddProperty(propertySchema: PropertySchemaTemplate) {
    // PropertyTypeSelectionMenu types its selection as the base schema
    // template, so which concrete property schema it is has already been
    // widened away by the time it reaches here.
    const draftProperty = {
      ...propertySchema,
      name: i18n.t(propertySchema.name),
      id: Date.now(),
    } as DraftProperty;

    setDraftProperties((prevDrafts) => [...prevDrafts, draftProperty]);
  }

  // Remove a draft property by its ID
  function removeDraftProperty(id: number) {
    setDraftProperties((prevDrafts) => prevDrafts.filter((p) => p.id !== id));
  }

  // Add a new draft entry template
  function handleAddEntryTemplate() {
    const draftTemplate: DraftEntryTemplate = { draftId: Date.now() };

    setDraftTemplates((prevDrafts) => [...prevDrafts, draftTemplate]);
  }

  // Remove a draft entry template by its draft ID
  function removeDraftTemplate(draftId: number) {
    setDraftTemplates((prevDrafts) =>
      prevDrafts.filter((draft) => draft.draftId !== draftId),
    );
  }

  if (!databaseConfig) {
    return null;
  }

  return (
    <Panel className="database-configuration-panel">
      <Tabs
        className="database-configuration-panel-tabs-container"
        value={showSettings ? '' : activeTab}
        onValueChange={(value) => setActiveTab(value as ConfigPanelTab)}
      >
        <div className="database-configuration-panel-tabs">
          <IconButton
            size="md"
            label="labels.settings"
            icon="settings-2"
            color="muted"
            active={showSettings}
            onClick={() => setActiveTab('settings')}
          />
          <Spacer />
          <TabsList>
            <TabsTab value="properties" size="sm">
              {i18n.t('labels.properties')}
            </TabsTab>
            <TabsTab value="templates" size="sm">
              {i18n.t('labels.templates')}
            </TabsTab>
            <TabsTab value="designs" size="sm">
              {i18n.t('labels.design')}
            </TabsTab>
          </TabsList>
          <Spacer />
          {!showSettings && activeTab === 'properties' && (
            <PropertyTypeSelectionMenu
              existingProperties={[
                ...databaseConfig.properties,
                ...draftProperties,
              ]}
              onSelect={handleAddProperty}
            >
              <IconButton
                size="md"
                label="databases.actions.addProperty"
                icon="plus"
              />
            </PropertyTypeSelectionMenu>
          )}
          {!showSettings && activeTab === 'templates' && (
            <IconButton
              size="md"
              label="databases.entryTemplates.actions.add"
              icon="plus"
              onClick={handleAddEntryTemplate}
            />
          )}
          {(showSettings ||
            (activeTab !== 'properties' && activeTab !== 'templates')) && (
            <IconButtonSpacer size="md" />
          )}
        </div>

        {showSettings ? (
          <VerticalScrollArea stateKey="settings">
            <div className="database-configuration-panel-settings-content">
              <DatabaseSettingsPanel key={databaseId} databaseId={databaseId} />
            </div>
          </VerticalScrollArea>
        ) : (
          <>
            <TabsPanel value="properties">
              <VerticalScrollArea stateKey="properties">
                <div className="database-configuration-panel-properties-content">
                  <DatabasePropertiesEditor
                    databaseId={databaseId}
                    draftProperties={draftProperties}
                    onSaveDraft={removeDraftProperty}
                    onCancelDraft={removeDraftProperty}
                  />
                </div>
              </VerticalScrollArea>
            </TabsPanel>

            <TabsPanel value="templates">
              <VerticalScrollArea stateKey="templates">
                <div className="database-configuration-panel-templates-content">
                  <DatabaseEntryTemplatesEditor
                    databaseId={databaseId}
                    draftTemplates={draftTemplates}
                    onSaveDraft={removeDraftTemplate}
                    onCancelDraft={removeDraftTemplate}
                  />
                </div>
              </VerticalScrollArea>
            </TabsPanel>

            <TabsPanel value="designs">
              <VerticalScrollArea stateKey="designs">
                <div className="database-configuration-panel-designs-content">
                  <DatabaseDesignPanel databaseId={databaseId} />
                </div>
              </VerticalScrollArea>
            </TabsPanel>
          </>
        )}
      </Tabs>
    </Panel>
  );
};
