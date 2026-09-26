import { useState } from 'react';
import {
  CustomContentType,
  CustomContentTypeData,
  CustomContentTypeKind,
  CustomContentTypes,
  Databases,
} from '@minddrop/databases';
import { createI18nKeyBuilder, useTranslation } from '@minddrop/i18n';
import { DatabaseCombobox } from '@minddrop/ui-components';
import {
  Button,
  ChipsField,
  FieldLabel,
  FieldRoot,
  FieldValidationError,
  Group,
  Spacer,
  Stack,
  TextField,
} from '@minddrop/ui-primitives';
import './CustomContentTypeForm.css';

const customKey = createI18nKeyBuilder(
  'databases.settings.contentDefaults.custom.',
);
const contentDefaultKey = createI18nKeyBuilder(
  'databases.settings.contentDefaults.',
);

/**
 * The values the form submits. The kind is fixed by the form.
 */
export type CustomContentTypeFormValues = Omit<CustomContentTypeData, 'kind'>;

export interface CustomContentTypeFormProps {
  /**
   * Whether the type matches files or URLs.
   */
  kind: CustomContentTypeKind;

  /**
   * The type being edited. Omit to create a new type.
   */
  customType?: CustomContentType;

  /**
   * Called with the form values when the form is saved.
   */
  onSubmit: (values: CustomContentTypeFormValues) => void;

  /**
   * Called when the form is cancelled.
   */
  onCancel: () => void;

  /**
   * Called when the type is deleted. Omit to hide the delete button.
   */
  onDelete?: () => void;
}

/**
 * Renders the form for creating or editing a custom content type.
 */
export const CustomContentTypeForm: React.FC<CustomContentTypeFormProps> = ({
  kind,
  customType,
  onSubmit,
  onCancel,
  onDelete,
}) => {
  // The type's name
  const [name, setName] = useState(customType?.name ?? '');
  // The extensions or domains the type matches
  const [matchers, setMatchers] = useState(customType?.matchers ?? []);
  // The database matched content is added to
  const [databaseId, setDatabaseId] = useState(customType?.databaseId ?? null);
  const { t } = useTranslation();
  // Get the databases accepting the kind of content
  const acceptingDatabases = Databases.useByContentType(kind);

  // Normalize a matcher as it will be stored
  function normalizeMatcher(matcher: string): string {
    return CustomContentTypes.normalizeMatcher(kind, matcher);
  }

  // Reject a matcher another content type already uses
  function validateMatcher(matcher: string): FieldValidationError | false {
    // Resolve the name of the content type using the matcher
    const ownerName = resolveMatcherOwnerName(matcher);

    // Check if another content type uses the matcher. If so, reject it
    // with the name of that type.
    if (ownerName) {
      return { key: customKey('matcherTaken'), values: { type: ownerName } };
    }

    return false;
  }

  // Resolve the name of the content type already using a matcher, if any
  function resolveMatcherOwnerName(matcher: string): string | null {
    // Find the content type using the matcher, ignoring the type being edited
    const owner = CustomContentTypes.findMatcherOwner(
      kind,
      matcher,
      customType?.id,
    );

    if (!owner) {
      return null;
    }

    // Name a built-in file content type by its label
    if (typeof owner === 'string') {
      return t(contentDefaultKey(owner, 'label'));
    }

    // Name a custom content type by its name
    return owner.name;
  }

  // Submit the form values with the name trimmed
  function handleSubmit() {
    onSubmit({ name: name.trim(), matchers, databaseId });
  }

  return (
    <Stack className="custom-content-type-form">
      {/* The type's name */}
      <TextField
        autoFocus
        size="md"
        label={customKey('name', 'label')}
        placeholder={customKey('name', `placeholder.${kind}`)}
        value={name}
        onValueChange={setName}
      />

      {/* The extensions or domains the type matches. Space adds a chip. */}
      <ChipsField
        splitOnSpace
        size="md"
        label={customKey('matchers', `${kind}.label`)}
        placeholder={customKey('matchers', `${kind}.placeholder`)}
        value={matchers}
        normalize={normalizeMatcher}
        validate={validateMatcher}
        onValueChange={setMatchers}
      />

      {/* The database matched content is added to */}
      <FieldRoot>
        <FieldLabel label={customKey('database', 'label')} />
        <DatabaseCombobox
          allowNone
          size="md"
          valueVariant="text"
          databases={acceptingDatabases}
          value={databaseId}
          onValueChange={setDatabaseId}
        />
      </FieldRoot>

      {/* Actions */}
      <Group gap={2}>
        {/* Delete the type. Only when editing an existing type. */}
        {onDelete && (
          <Button
            variant="ghost"
            danger="always"
            label="actions.delete"
            onClick={onDelete}
          />
        )}

        {/* Push the cancel and save buttons to the end */}
        <Spacer />

        {/* Cancel */}
        <Button variant="ghost" label="actions.cancel" onClick={onCancel} />
        {/* Save the type */}
        <Button
          variant="solid"
          color="primary"
          label="actions.save"
          disabled={!name.trim() || !matchers.length}
          onClick={handleSubmit}
        />
      </Group>
    </Stack>
  );
};
