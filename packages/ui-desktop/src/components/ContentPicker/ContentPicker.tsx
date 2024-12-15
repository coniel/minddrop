import React, { useCallback, useState } from 'react';
import { Document, useAllDocuments } from '@minddrop/documents';
import { useTranslation } from '@minddrop/i18n';
import {
  NavGroup,
  PopoverContent,
  PopoverContentProps,
  TextInput,
} from '@minddrop/ui-elements';
import { fuzzySearch } from '@minddrop/utils';
import { Workspace, useWorkspaces } from '@minddrop/workspaces';
import { ContentPickerDocumentItem } from './ContentPickerDocumentItem';
import { ContentPickerWorkspaceItem } from './ContentPickerWorkspaceItem';
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
   * Workspace path or document ID to omit from the list.
   */
  omit?: string;

  /**
   * Deteminates which type of content can be picked.
   */
  pickable?: 'workspace' | 'document' | 'any';

  /**
   * The alignment of the popover content.
   */
  align?: PopoverContentProps['align'];

  /**
   * The side of the popover content.
   */
  side?: PopoverContentProps['side'];
}

export const ContentPicker = React.forwardRef<
  HTMLDivElement,
  ContentPickerProps
>(
  (
    {
      omit,
      onClose,
      onSelect,
      align = 'start',
      side = 'bottom',
      pickable = 'any',
    },
    ref,
  ) => {
    const { t } = useTranslation('contentPicker');

    // Get all workspaces except for possible omitted one
    const allWorkspaces = useWorkspaces().filter(
      (workspace) => workspace.path !== omit,
    );
    // Get all documents except for possible omitted one
    const allDocuments = useAllDocuments().filter(
      (document) => document.id !== omit,
    );
    // Filter search query
    const [query, setQuery] = useState('');
    // Filtered workspaces
    const [filteredWorkspaces, setFilteredWorkspaces] = useState(allWorkspaces);
    // Filtered documents
    const [filteredDocuments, setFilteredDocuments] = useState(allDocuments);

    const handleQueryChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setQuery(value);

        if (value) {
          const filteredWorkspaceTitles = fuzzySearch(
            allWorkspaces.map((workspace) => workspace.name),
            value,
          );
          const filteredDocumentTitles = fuzzySearch(
            allDocuments.map((document) => document.title),
            value,
          );

          setFilteredWorkspaces(
            filteredWorkspaceTitles
              .map((name) =>
                allWorkspaces.find((workspace) => workspace.name === name),
              )
              .filter(
                (workspace): workspace is Workspace => workspace !== null,
              ),
          );

          setFilteredDocuments(
            filteredDocumentTitles
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
        align={align}
        side={side}
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
                pickable={pickable}
                omitDocumentId={omit}
                onClick={onSelect}
              />
            ))}
          {query && (
            <>
              {(pickable === 'workspace' || pickable === 'any') &&
                filteredWorkspaces.length > 0 && (
                  <div className="search-group">
                    <NavGroup title="Workspaces" />
                    {filteredWorkspaces.map((workspace) => (
                      <ContentPickerWorkspaceItem
                        key={workspace.path}
                        path={workspace.path}
                        omitDocumentId={omit}
                        onClick={onSelect}
                      />
                    ))}
                  </div>
                )}
              {(pickable === 'document' || pickable === 'any') &&
                filteredDocuments.length > 0 && (
                  <div className="search-group">
                    <NavGroup title="Documents" />
                    {filteredDocuments.map((document) => (
                      <ContentPickerDocumentItem
                        key={document.id}
                        id={document.id}
                        omitSubdocument={omit}
                        onClick={onSelect}
                      />
                    ))}
                  </div>
                )}
              {filteredWorkspaces.length === 0 &&
                filteredDocuments.length === 0 && (
                  <NavGroup title={t('noResults')} />
                )}
            </>
          )}
        </div>
      </PopoverContent>
    );
  },
);

ContentPicker.displayName = 'ContentPicker';
