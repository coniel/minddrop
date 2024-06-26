import React, { useCallback, useState } from 'react';
import { NavGroup, PopoverContent, TextInput } from '@minddrop/ui';
import { Workspace, useWorkspaces } from '@minddrop/workspaces';
import { ContentPickerWorkspaceItem } from './ContentPickerWorkspaceItem';
import { Document, useDocuments } from '@minddrop/documents';
import { fuzzySearch } from '@minddrop/utils';
import { ContentPickerDocumentItem } from './ContentPickerDocumentItem';
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
  // Get all documents except for possible omitted one
  const allDocuments = useDocuments().filter(
    (document) => document.path !== omit,
  );
  // Filter search query
  const [query, setQuery] = useState('');
  // Filtered workspaces
  const [filteredWorkspaces, setFilteredWorkspaces] = useState(allWorkspaces);
  // Filtered documents
  const [filteredDocuments, setFilteredDocuments] = useState(allDocuments);
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
        const filteredDocumentPaths = fuzzySearch(
          allDocuments.map((document) => document.title),
          value,
        );

        setFilteredWorkspaces(
          filteredWorkspacePaths
            .map((name) =>
              allWorkspaces.find((workspace) => workspace.name === name),
            )
            .filter((workspace): workspace is Workspace => workspace !== null),
        );

        setFilteredDocuments(
          filteredDocumentPaths
            .map((title) =>
              allDocuments.find((document) => document.title === title),
            )
            .filter((document): document is Document => document !== null),
        );
      }
    },
    [allDocuments, allWorkspaces],
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
              omitDocument={omit}
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
                  omitDocument={omit}
                  onClick={onSelect}
                />
              ))}
            </div>
            <div className="search-group">
              <NavGroup title="Documents" />
              {filteredDocuments.map((document) => (
                <ContentPickerDocumentItem
                  key={document.path}
                  path={document.path}
                  omitSubdocument={omit}
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
