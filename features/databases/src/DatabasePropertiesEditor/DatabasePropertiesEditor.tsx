import { Databases } from '@minddrop/databases';
import { PropertySchema } from '@minddrop/properties';
import { DatabasePropertyEditor } from '../DatabasePropertyEditor';

type DraftProperty = PropertySchema & {
  id: number;
};

export interface DatabasePropertiesEditorProps
  extends React.HTMLProps<HTMLDivElement> {
  /**
   * The database ID.
   */
  databaseId: string;

  /**
   * Draft properties that have not yet been saved.
   */
  draftProperties: DraftProperty[];

  /**
   * Callback when a draft property is saved.
   */
  onSaveDraft: (id: number) => void;

  /**
   * Callback when a draft property creation is cancelled.
   */
  onCancelDraft: (id: number) => void;
}

/**
 * Renders the list of draft and persisted database property editors.
 */
export const DatabasePropertiesEditor: React.FC<
  DatabasePropertiesEditorProps
> = ({ databaseId, draftProperties, onSaveDraft, onCancelDraft }) => {
  const databaseConfig = Databases.use(databaseId);

  if (!databaseConfig) {
    return null;
  }

  return (
    <div>
      {/* Draft properties appear at the top */}
      {draftProperties.map((property) => (
        <DatabasePropertyEditor
          isDraft
          key={property.name}
          databaseId={databaseId}
          property={property}
          onSaveDraft={() => onSaveDraft(property.id)}
          onCancelDraft={() => onCancelDraft(property.id)}
        />
      ))}
      {/* Persisted properties in reverse order */}
      {databaseConfig.properties.toReversed().map((property) => (
        <DatabasePropertyEditor
          key={property.name}
          databaseId={databaseId}
          property={property}
        />
      ))}
    </div>
  );
};
