import React, { useCallback } from 'react';
import {
  Database,
  DatabaseEntries,
  DatabaseEntryTemplates,
  Databases,
} from '@minddrop/databases';
import { Designs } from '@minddrop/designs-next';
import { useTranslation } from '@minddrop/i18n';
import { PanelView, PanelViewProps } from '@minddrop/ui-components';
import {
  DropdownMenu,
  DropdownMenuItem,
  IconButton,
  useTransientState,
} from '@minddrop/ui-primitives';
import { Views } from '@minddrop/views';
import { DatabaseBrowseMode } from '../DatabaseBrowseMode';
import { DatabaseConfigurationPanel } from '../DatabaseConfigurationPanel';
import { DatabaseDesignMode } from '../DatabaseDesignMode';
import { DatabaseEmptyMode } from '../DatabaseEmptyMode';
import './DatabaseView.css';

// The subview the database view shows while in design mode, editing
// the database's designs in place of browsing its entries. Recorded
// in the tab's history, so it trails the database in the breadcrumbs
// and stays local to the tab.
const DesignsSubviewId = 'designs';

export interface DatabaseViewProps {
  /**
   * The ID of the database to display.
   */
  databaseId: string;

  /**
   * Whether the configuration panel starts open. Ignored when the
   * view's session has already shown the database, which then keeps
   * the panel as it was.
   *
   * @default false
   */
  configurationPanelOpen?: boolean;
}

/**
 * Renders a database in one of three modes: browsing its entries
 * through its views, the empty placeholder while it has none, or
 * design mode editing its designs, with the database's configuration
 * panel beside it when open.
 */
export const DatabaseView: React.FC<DatabaseViewProps> = ({
  databaseId,
  configurationPanelOpen: configurationPanelOpenByDefault = false,
}) => {
  const database = Databases.use(databaseId);
  const entryTemplates = DatabaseEntryTemplates.useAll(databaseId);
  const entryIds = DatabaseEntries.useIds(databaseId);
  const subview = Views.useSubview();
  const setSubview = Views.useSetSubview();
  const { t } = useTranslation();

  // Whether the configuration panel is open, remembered with the
  // view's session.
  const [configurationPanelOpen, setConfigurationPanelOpen] = useTransientState(
    'configPanelOpen',
    configurationPanelOpenByDefault,
  );

  // Design mode is the tab showing the designs subview
  const designMode = subview?.id === DesignsSubviewId;

  // Determine whether the database is empty
  const isEmpty = entryIds.length === 0;

  // Toggle the configuration panel
  const toggleConfigurationPanel = useCallback(() => {
    setConfigurationPanelOpen(!configurationPanelOpen);
  }, [configurationPanelOpen, setConfigurationPanelOpen]);

  // Enter design mode by showing the designs subview, a navigation in
  // the tab's history. The database's breadcrumb leads back out.
  const enterDesignMode = useCallback(() => {
    setSubview({
      id: DesignsSubviewId,
      title: t('databases.design.title'),
      icon: Designs.constants.Icon,
    });
  }, [setSubview, t]);

  async function handleClickNewEntry() {
    if (!database) {
      return;
    }

    DatabaseEntries.create(database.id);
  }

  // Create a new entry from one of the database's entry templates
  function handleCreateEntryFromTemplate(templateId: string) {
    if (!database) {
      return;
    }

    DatabaseEntries.createFromTemplate(templateId);
  }

  // Render the new entry action, wrapping it in a template
  // selection menu when the database has entry templates.
  function renderNewEntryAction() {
    // Without templates, a plain action creates a blank entry
    if (!database || !entryTemplates.length) {
      return {
        icon: 'plus' as const,
        label: 'databases.actions.newEntry' as const,
        onClick: handleClickNewEntry,
      };
    }

    // With templates, the action opens a menu with a blank entry
    // option followed by the templates.
    return (
      <DropdownMenu
        key="new-entry"
        trigger={
          <IconButton
            icon="plus"
            label="databases.actions.newEntry"
            color="neutral"
          />
        }
      >
        <DropdownMenuItem
          label="databases.entryTemplates.menus.blankEntry"
          contentIcon={database.icon}
          onSelect={handleClickNewEntry}
        />
        {entryTemplates.map((template) => (
          <DropdownMenuItem
            key={template.id}
            stringLabel={template.name}
            contentIcon={database.icon}
            onSelect={() => handleCreateEntryFromTemplate(template.id)}
          />
        ))}
      </DropdownMenu>
    );
  }

  // Renders the panel content for the current mode
  function renderMode() {
    // Design mode replaces the views and entries with the database's
    // designs and the design editor.
    if (designMode) {
      return <DatabaseDesignMode databaseId={databaseId} />;
    }

    if (isEmpty) {
      return <DatabaseEmptyMode />;
    }

    return <DatabaseBrowseMode databaseId={databaseId} />;
  }

  if (!database) {
    return <div className="database-view">Database not found.</div>;
  }

  return (
    <div className="database-view">
      <PanelView
        className="database"
        {...resolveHeaderProps(database, designMode)}
        actions={[
          // Design mode keeps only the configuration panel toggle
          ...(designMode
            ? []
            : [
                {
                  icon: Designs.constants.Icon,
                  label: 'databases.design.actions.designMode' as const,
                  tooltip: {
                    title: 'databases.design.actions.designMode' as const,
                  },
                  onClick: enterDesignMode,
                },
                renderNewEntryAction(),
              ]),
          {
            icon: configurationPanelOpen
              ? 'panel-right-close'
              : 'panel-right-open',
            label: 'databases.actions.configuration',
            onClick: toggleConfigurationPanel,
          },
        ]}
      >
        {renderMode()}
      </PanelView>
      {configurationPanelOpen && (
        <DatabaseConfigurationPanel databaseId={databaseId} />
      )}
    </div>
  );
};

/**
 * Resolves the panel header: the database's name and icon, or the
 * designs title in design mode, the database itself then trailing
 * as a breadcrumb of the subview.
 *
 * @param database - The database shown.
 * @param designMode - Whether the view is in design mode.
 * @returns The header props.
 */
function resolveHeaderProps(
  database: Database,
  designMode: boolean,
): Pick<PanelViewProps, 'title' | 'stringTitle' | 'icon' | 'contentIcon'> {
  if (!designMode) {
    return { stringTitle: database.name, contentIcon: database.icon };
  }

  return { title: 'databases.design.title', icon: Designs.constants.Icon };
}
