import { useCallback, useMemo } from 'react';
import {
  DatabaseEntryTemplate,
  DatabaseEntryTemplates,
  Databases,
} from '@minddrop/databases';
import {
  SortableItemRenderProps,
  SortableList,
} from '@minddrop/ui-drag-and-drop';
import { Text } from '@minddrop/ui-primitives';
import { DatabaseEntryTemplateEditor } from '../DatabaseEntryTemplateEditor';
import './DatabaseEntryTemplatesEditor.css';

export interface DraftEntryTemplate {
  /**
   * Locally unique ID used to track the draft until it is saved.
   */
  draftId: number;
}

export interface DatabaseEntryTemplatesEditorProps {
  /**
   * The database ID.
   */
  databaseId: string;

  /**
   * Draft templates that have not yet been saved.
   */
  draftTemplates: DraftEntryTemplate[];

  /**
   * Callback when a draft template is saved.
   */
  onSaveDraft: (draftId: number) => void;

  /**
   * Callback when a draft template creation is cancelled.
   */
  onCancelDraft: (draftId: number) => void;
}

/**
 * Renders the list of draft and persisted database entry template
 * editors.
 */
export const DatabaseEntryTemplatesEditor: React.FC<
  DatabaseEntryTemplatesEditorProps
> = ({ databaseId, draftTemplates, onSaveDraft, onCancelDraft }) => {
  const databaseConfig = Databases.use(databaseId);
  const templates = DatabaseEntryTemplates.useAll(databaseId);

  // Template IDs used as sortable item IDs
  const templateIds = useMemo(
    () => templates.map((template) => template.id),
    [templates],
  );

  // Build a lookup map for persisted templates by ID
  const templateMap = useMemo(() => {
    const map = new Map<string, DatabaseEntryTemplate>();

    for (const template of templates) {
      map.set(template.id, template);
    }

    return map;
  }, [templates]);

  // Handle sort by persisting the new order as the config's
  // template ID list.
  const handleSort = useCallback(
    (newOrder: string[]) => {
      Databases.update(databaseId, { entryTemplates: newOrder });
    },
    [databaseId],
  );

  // Render each sortable template item
  const renderItem = useCallback(
    (id: string, sortableProps: SortableItemRenderProps) => {
      const template = templateMap.get(id);

      if (!template) {
        return null;
      }

      return (
        <div
          ref={sortableProps.ref}
          style={sortableProps.style}
          className={sortableProps.className}
        >
          <DatabaseEntryTemplateEditor
            databaseId={databaseId}
            template={template}
            dragHandleProps={sortableProps.handleProps}
          />
        </div>
      );
    },
    [databaseId, templateMap],
  );

  if (!databaseConfig) {
    return null;
  }

  return (
    <div>
      {/* Description of what templates are, shown until the
          database has one */}
      {!templateIds.length && !draftTemplates.length && (
        <Text
          block
          size="sm"
          color="muted"
          className="database-entry-templates-editor-empty"
          text="databases.entryTemplates.empty"
        />
      )}
      {/* Persisted templates in natural order, sortable */}
      <SortableList
        items={templateIds}
        direction="vertical"
        gap={1}
        onSort={handleSort}
        renderItem={renderItem}
        className="database-entry-templates-editor-sortable"
      />
      {/* Draft templates appear at the bottom */}
      {draftTemplates.map((draft) => (
        <DatabaseEntryTemplateEditor
          isDraft
          key={draft.draftId}
          databaseId={databaseId}
          template={{
            id: 'database-entry-template_draft',
            name: '',
            properties: {},
          }}
          onSaveDraft={() => onSaveDraft(draft.draftId)}
          onCancelDraft={() => onCancelDraft(draft.draftId)}
        />
      ))}
    </div>
  );
};
