import { useState } from 'react';
import { Databases } from '@minddrop/databases';
import { NewDesignMenu } from '@minddrop/feature-designs';
import { PropertyTypeSelectionMenu } from '@minddrop/feature-properties';
import { i18n } from '@minddrop/i18n';
import { PropertySchema } from '@minddrop/properties';
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

type DraftProperty = PropertySchema & {
  id: number;
};

type ActiveTab = 'properties' | 'designs' | 'settings';

/**
 * Renders the database configuration panel with tabbed
 * Properties, Designs, and Settings sections.
 */
export const DatabaseConfigurationPanel: React.FC<
  DatabaseConfigurationPanelProps
> = ({ databaseId }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('properties');
  const [draftProperties, setDraftProperties] = useState<DraftProperty[]>([]);
  const databaseConfig = Databases.use(databaseId);

  // Add a new draft property from the type selection menu
  function handleAddProperty(propertySchema: PropertySchema) {
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
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as ActiveTab)}
      >
        <div className="database-configuration-panel-tabs">
          <IconButtonSpacer size="sm" />
          <Spacer />
          <TabsList>
            <TabsTab value="properties" size="sm">
              {i18n.t('labels.properties')}
            </TabsTab>
            <TabsTab value="designs" size="sm">
              {i18n.t('labels.designs')}
            </TabsTab>
            <TabsTab value="settings" size="sm">
              {i18n.t('labels.settings')}
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
          {activeTab === 'settings' && <IconButtonSpacer size="sm" />}
        </div>

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

        <TabsPanel value="settings">
          <ScrollArea>
            <div className="database-configuration-panel-settings-content" />
          </ScrollArea>
        </TabsPanel>
      </Tabs>
    </Panel>
  );
};
