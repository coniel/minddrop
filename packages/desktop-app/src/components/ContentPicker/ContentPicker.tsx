import React, { useCallback, useState } from 'react';
import { NavGroup, PopoverContent, TextInput } from '@minddrop/ui';
import { Workspace, useWorkspaces } from '@minddrop/workspaces';
import { ContentPickerWorkspaceItem } from './ContentPickerWorkspaceItem';
import { Page, usePages } from '@minddrop/pages';
import { fuzzySearch } from '@minddrop/utils';
import { ContentPickerPageItem } from './ContentPickerPageItem';
import './ContentPicker.css';

export interface ContentPickerProps {
  /**
   * Callback fired when the popover closes.
   */
  onClose(): void;

  /**
   * Callback fired when a content item is selected.
   */
  onSelect(path: string): void;

  /**
   * Path to omit from the list.
   */
  omit?: string;
}

export const ContentPicker = React.forwardRef<
  HTMLDivElement,
  ContentPickerProps
>(({ omit, onClose, onSelect }, ref) => {
  // Get all workspaces except for possible omitted one
  const allWorkspaces = useWorkspaces().filter(
    (workspace) => workspace.path !== omit,
  );
  // Get all pages except for possible omitted one
  const allPages = usePages().filter((page) => page.path !== omit);
  // Filter search query
  const [query, setQuery] = useState('');
  // Filtered workspaces
  const [filteredWorkspaces, setFilteredWorkspaces] = useState(allWorkspaces);
  // Filtered pages
  const [filteredPages, setFilteredPages] = useState(allPages);
  console.log('render');

  const handleQueryChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setQuery(value);

      if (value) {
        const filteredWorkspacePaths = fuzzySearch(
          allWorkspaces.map((workspace) => workspace.name),
          value,
        );
        const filteredPagePaths = fuzzySearch(
          allPages.map((page) => page.title),
          value,
        );

        setFilteredWorkspaces(
          filteredWorkspacePaths
            .map((name) =>
              allWorkspaces.find((workspace) => workspace.name === name),
            )
            .filter((workspace): workspace is Workspace => workspace !== null),
        );

        setFilteredPages(
          filteredPagePaths
            .map((title) => allPages.find((page) => page.title === title))
            .filter((page): page is Page => page !== null),
        );
      }
    },
    [allPages, allWorkspaces],
  );

  return (
    <PopoverContent
      ref={ref}
      align="start"
      side="bottom"
      className="content-picker"
      onPointerDownOutside={onClose}
      onEscapeKeyDown={onClose}
    >
      <div className="search-field">
        <TextInput
          autoFocus
          placeholder="contentPicker.filter"
          onChange={handleQueryChange}
        />
      </div>
      <div className="content">
        {!query &&
          allWorkspaces.map((workspace) => (
            <ContentPickerWorkspaceItem
              key={workspace.path}
              path={workspace.path}
              omitPage={omit}
              onClick={onSelect}
            />
          ))}
        {query && (
          <>
            <div className="search-group">
              <NavGroup title="Workspaces" />
              {filteredWorkspaces.map((workspace) => (
                <ContentPickerWorkspaceItem
                  key={workspace.path}
                  path={workspace.path}
                  omitPage={omit}
                  onClick={onSelect}
                />
              ))}
            </div>
            <div className="search-group">
              <NavGroup title="Pages" />
              {filteredPages.map((page) => (
                <ContentPickerPageItem
                  key={page.path}
                  path={page.path}
                  omitSubpage={omit}
                  onClick={onSelect}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </PopoverContent>
  );
});

ContentPicker.displayName = 'ContentPicker';
