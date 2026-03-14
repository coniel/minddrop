import { useState } from 'react';
import { Databases } from '@minddrop/databases';
import { NewDesignMenu } from '@minddrop/feature-designs';
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
import { DatabaseDesignsMenu } from '../DatabaseDesignsMenu';
import { DatabasePropertiesEditor } from '../DatabasePropertiesEditor';
import { OpenDatabaseViewEvent } from '../events';
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

type ActiveTab = 'queries' | 'collections' | 'properties' | 'designs';

/**
 * Renders the database configuration panel with tabbed
 * Properties, Designs, and Settings sections.
 */
export const DatabaseConfigurationPanel: React.FC<
  DatabaseConfigurationPanelProps
> = ({ databaseId }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('queries');
  const [showSettings, setShowSettings] = useState(false);
  const [draftProperties, setDraftProperties] = useState<DraftProperty[]>([]);
  const databaseConfig = Databases.use(databaseId);

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
        onValueChange={(value) => {
          setActiveTab(value as ActiveTab);
          setShowSettings(false);
        }}
      >
        <div className="database-configuration-panel-tabs">
          <IconButton
            size="sm"
            label="labels.settings"
            icon="settings"
            active={showSettings}
            onClick={() => setShowSettings(true)}
          />
          <Spacer />
          <TabsList>
            <TabsTab value="queries" size="sm">
              {i18n.t('labels.queries')}
            </TabsTab>
            <TabsTab value="collections" size="sm">
              {i18n.t('labels.collections')}
            </TabsTab>
            <TabsTab value="properties" size="sm">
              {i18n.t('labels.properties')}
            </TabsTab>
            <TabsTab value="designs" size="sm">
              {i18n.t('labels.designs')}
            </TabsTab>
          </TabsList>
          <Spacer />
          {activeTab === 'properties' && (
            <PropertyTypeSelectionMenu
              existingProperties={[
                ...databaseConfig.properties,
                ...draftProperties,
              ]}
              onSelect={handleAddProperty}
            >
              <IconButton
                size="sm"
                label="databases.actions.addProperty"
                icon="plus"
              />
            </PropertyTypeSelectionMenu>
          )}
          {activeTab === 'designs' && (
            <NewDesignMenu
              databaseId={databaseId}
              backEvent={OpenDatabaseViewEvent}
              backEventData={{ databaseId, configurationPanelOpen: true }}
            />
          )}
          {activeTab !== 'properties' && activeTab !== 'designs' && (
            <IconButtonSpacer size="sm" />
          )}
        </div>

        {showSettings ? (
          <ScrollArea>
            <div className="database-configuration-panel-settings-content" />
          </ScrollArea>
        ) : (
          <>
            <TabsPanel value="queries">
              <ScrollArea>
                <div className="database-configuration-panel-queries-content" />
              </ScrollArea>
            </TabsPanel>

            <TabsPanel value="collections">
              <ScrollArea>
                <div className="database-configuration-panel-collections-content" />
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
                  <DatabaseDesignsMenu databaseId={databaseId} />
                </div>
              </ScrollArea>
            </TabsPanel>
          </>
        )}
      </Tabs>
    </Panel>
  );
};
