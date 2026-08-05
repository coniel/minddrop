import { useCallback, useState } from 'react';
import { Databases } from '@minddrop/databases';
import { PropertyTypeSelectionMenu } from '@minddrop/feature-properties';
import { i18n } from '@minddrop/i18n';
import { PropertySchema, PropertySchemaTemplate } from '@minddrop/properties';
import {
  IconButton,
  IconButtonSpacer,
  Panel,
  ScrollArea,
  Spacer,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
} from '@minddrop/ui-primitives';
import { DatabaseDesignPanel } from '../DatabaseDesignPanel';
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
            <TabsTab value="designs" size="sm">
              {i18n.t('labels.design')}
            </TabsTab>
            <TabsTab value="templates" size="sm">
              {i18n.t('labels.templates')}
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
          {(showSettings || activeTab !== 'properties') && (
            <IconButtonSpacer size="md" />
          )}
        </div>

        {showSettings ? (
          <ScrollArea>
            <div className="database-configuration-panel-settings-content">
              <DatabaseSettingsPanel key={databaseId} databaseId={databaseId} />
            </div>
          </ScrollArea>
        ) : (
          <>
            <TabsPanel value="templates">
              <ScrollArea>
                <div className="database-configuration-panel-templates-content" />
              </ScrollArea>
            </TabsPanel>

            <TabsPanel value="properties">
              <ScrollArea>
                <div className="database-configuration-panel-properties-content">
                  <DatabasePropertiesEditor
                    databaseId={databaseId}
                    draftProperties={draftProperties}
                    onSaveDraft={removeDraftProperty}
                    onCancelDraft={removeDraftProperty}
                  />
                </div>
              </ScrollArea>
            </TabsPanel>

            <TabsPanel value="designs">
              <ScrollArea>
                <div className="database-configuration-panel-designs-content">
                  <DatabaseDesignPanel databaseId={databaseId} />
                </div>
              </ScrollArea>
            </TabsPanel>
          </>
        )}
      </Tabs>
    </Panel>
  );
};
