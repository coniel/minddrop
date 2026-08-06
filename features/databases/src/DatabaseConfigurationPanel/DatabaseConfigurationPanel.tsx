import { useCallback, useState } from 'react';
import { Databases } from '@minddrop/databases';
import { PropertyTypeSelectionMenu } from '@minddrop/feature-properties';
import { i18n } from '@minddrop/i18n';
import { PropertySchema, PropertySchemaTemplate } from '@minddrop/properties';
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
} from '@minddrop/ui-primitives';
import { DatabaseDesignPanel } from '../DatabaseDesignPanel';
import {
  DatabaseEntryTemplatesEditor,
  DraftEntryTemplate,
} from '../DatabaseEntryTemplatesEditor';
import { DatabasePropertiesEditor } from '../DatabasePropertiesEditor';
import { DatabaseSettingsPanel } from '../DatabaseSettingsPanel';
import {
  ConfigPanelTab,
  setDatabaseViewState,
  useDatabaseViewState,
} from '../DatabaseViewStateStore';
import './DatabaseConfigurationPanel.css';

export interface DatabaseConfigurationPanelProps {
  /**
   * The database ID.
   */
  databaseId: string;
}

type DraftProperty = Omit<PropertySchema, 'name'> & {
  name: string;
  id: number;
};

/**
 * Renders the database configuration panel with tabbed
 * Properties, Designs, Templates, and Settings sections.
 */
export const DatabaseConfigurationPanel: React.FC<
  DatabaseConfigurationPanelProps
> = ({ databaseId }) => {
  const viewState = useDatabaseViewState(databaseId);
  const [draftProperties, setDraftProperties] = useState<DraftProperty[]>([]);
  const [draftTemplates, setDraftTemplates] = useState<DraftEntryTemplate[]>(
    [],
  );
  const databaseConfig = Databases.use(databaseId);

  // Read the active tab from persisted state
  const activeTab = viewState.configPanelTab;

  // Settings is a persisted tab value so it survives remounts (e.g. rename)
  const showSettings = activeTab === 'settings';

  // Persist the active tab when it changes
  const setActiveTab = useCallback(
    (tab: ConfigPanelTab) => {
      setDatabaseViewState(databaseId, { configPanelTab: tab });
    },
    [databaseId],
  );

  // Add a new draft property from the type selection menu
  function handleAddProperty(propertySchema: PropertySchemaTemplate) {
    const draftProperty: DraftProperty = {
      ...propertySchema,
      name: i18n.t(propertySchema.name),
      id: Date.now(),
    };

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
            icon="settings"
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
