import { FC, useCallback } from 'react';
import { useCollections } from '@minddrop/collections';
import { useTranslation } from '@minddrop/i18n';
import {
  NavGroup,
  SecondaryNavItem,
  Sidebar,
  Toolbar,
} from '@minddrop/ui-elements';
import { useWorkspaces } from '@minddrop/workspaces';
import { AppUiState, useSidebarWidth } from '../../AppUiState';
import { AddWorkspaceMenu } from '../AddWorkspaceMenu';
import { CollectionNavItem } from '../CollectionNavItem';
import { ThemeAppearanceSelect } from '../ThemeAppearanceSelect';
import { WorkspaceNavItem } from '../WorkspaceNavItem';
import './AppSidebar.css';

export const AppSidebar: FC = () => {
  const { t } = useTranslation();
  const initialWidth = useSidebarWidth();
  const workspaces = useWorkspaces();
  const collections = useCollections();

  const handleResize = useCallback(
    (value: number) => AppUiState.set('sidebarWidth', value),
    [],
  );

  return (
    <Sidebar
      className="app-sidebar"
      data-testid="AppSidebar"
      initialWidth={initialWidth}
      onResized={handleResize}
    >
      <div data-tauri-drag-region className="app-drag-handle" />
      <NavGroup label={t('workspaces.label')} title={t('workspaces.label')}>
        {workspaces.map((workspace) => (
          <WorkspaceNavItem key={workspace.path} workspace={workspace} />
        ))}
      </NavGroup>
      <NavGroup label={t('collections.label')} title={t('collections.label')}>
        {collections.map((collection) => (
          <CollectionNavItem key={collection.name} collection={collection} />
        ))}
      </NavGroup>
      <NavGroup label="Secondary">
        <AddWorkspaceMenu>
          <SecondaryNavItem
            icon="folder-add"
            label={t('workspaces.actions.add')}
          />
        </AddWorkspaceMenu>
      </NavGroup>
      <div className="flex" />
      <Toolbar className="bottom-toolbar">
        <ThemeAppearanceSelect />
      </Toolbar>
    </Sidebar>
  );
};
