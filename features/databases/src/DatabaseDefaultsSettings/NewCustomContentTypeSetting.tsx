import { useState } from 'react';
import { CustomContentTypeKind, CustomContentTypes } from '@minddrop/databases';
import { createI18nKeyBuilder } from '@minddrop/i18n';
import { UiIconName } from '@minddrop/ui-icons';
import {
  Button,
  DropdownMenu,
  DropdownMenuItem,
  Group,
  MenuGroup,
} from '@minddrop/ui-primitives';
import {
  CustomContentTypeForm,
  CustomContentTypeFormValues,
} from '../CustomContentTypeForm';
import './NewCustomContentTypeSetting.css';

const customKey = createI18nKeyBuilder(
  'databases.settings.contentDefaults.custom.',
);

// The menu icon of each kind
const KindIcons: Record<CustomContentTypeKind, UiIconName> = {
  file: 'file',
  url: 'link',
};

/**
 * Renders the button for adding a custom content type.
 */
export const NewCustomContentTypeSetting: React.FC = () => {
  // The kind of type being added, once picked
  const [kind, setKind] = useState<CustomContentTypeKind | null>(null);

  // Create the type and close the form
  function handleSubmit(values: CustomContentTypeFormValues) {
    if (!kind) {
      return;
    }

    CustomContentTypes.create({ ...values, kind });
    setKind(null);
  }

  // Show the form once a kind is picked
  if (kind) {
    return (
      <CustomContentTypeForm
        kind={kind}
        onSubmit={handleSubmit}
        onCancel={() => setKind(null)}
      />
    );
  }

  return (
    <Group className="database-defaults-settings-new-custom-content-type">
      <DropdownMenu
        minWidth={220}
        trigger={
          <Button variant="outline" startIcon="plus" label={customKey('add')} />
        }
      >
        <MenuGroup>
          {/* A menu item per kind */}
          {CustomContentTypes.constants.Kinds.map((typeKind) => (
            <DropdownMenuItem
              key={typeKind}
              icon={KindIcons[typeKind]}
              label={customKey('kinds', `${typeKind}.label`)}
              description={customKey('kinds', `${typeKind}.description`)}
              onSelect={() => setKind(typeKind)}
            />
          ))}
        </MenuGroup>
      </DropdownMenu>
    </Group>
  );
};
