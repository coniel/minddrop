import React, { useCallback, useMemo } from 'react';
import { Collections } from '@minddrop/collections';
import { CreateDatabaseEntryButton } from '@minddrop/ui-components';
import {
  ContentIcon,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  Heading,
  IconButton,
  Toolbar,
} from '@minddrop/ui-primitives';
import { ViewTypeComponentProps, ViewTypes, Views } from '@minddrop/views';
import './ViewRenderer.css';

export interface ViewRendererProps extends ViewTypeComponentProps {
  /**
   * Whether to show the header above the view content.
   * Displays the view's name and icon, along with settings
   * and new entry buttons.
   */
  showHeader?: boolean;
}

/**
 * Renders a view type component with an optional header.
 */
export const ViewRenderer: React.FC<ViewRendererProps> = ({
  view,
  entries,
  showHeader,
}) => {
  const viewType = ViewTypes.use(view.type);

  // Merge view type default options with the view's options
  const viewOptions = useMemo(
    () => ({ ...viewType?.defaultOptions, ...(view.options ?? {}) }),
    [viewType, view.options],
  );

  // Add newly created entry to the collection when
  // the view's data source is a collection
  const handleCreateEntry = useCallback(
    (entry: { id: string }) => {
      if (view.dataSource.type === 'collection') {
        Collections.addEntries(view.dataSource.id, [entry.id]);
      }
    },
    [view.dataSource],
  );

  // Update the view's options
  const handleUpdateViewOptions = useCallback(
    (options: object) => {
      Views.update(view.id, { options });
    },
    [view.id],
  );

  if (!viewType) {
    return null;
  }

  return (
    <div className="view-renderer">
      {/* Header with view icon, name, and action buttons */}
      {showHeader && (
        <div className="view-renderer-header">
          <div className="view-renderer-title">
            {view.icon && <ContentIcon icon={view.icon} />}
            <Heading noMargin>{view.name}</Heading>
          </div>
          <Toolbar>
            <CreateDatabaseEntryButton
              database={
                view.dataSource.type === 'database' ? view.dataSource.id : false
              }
              onCreateEntry={handleCreateEntry}
              color="neutral"
            />
            {viewType.settingsMenu && (
              <DropdownMenuRoot>
                <DropdownMenuTrigger>
                  <IconButton
                    icon="settings-2"
                    label="views.actions.settings"
                    color="neutral"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuPositioner side="bottom" align="end">
                    <DropdownMenuContent>
                      {React.createElement(viewType.settingsMenu, {
                        view,
                        options: viewOptions,
                        onUpdateOptions: handleUpdateViewOptions,
                      })}
                    </DropdownMenuContent>
                  </DropdownMenuPositioner>
                </DropdownMenuPortal>
              </DropdownMenuRoot>
            )}
          </Toolbar>
        </div>
      )}

      {/* View content */}
      <viewType.component view={view} entries={entries || []} />
    </div>
  );
};
