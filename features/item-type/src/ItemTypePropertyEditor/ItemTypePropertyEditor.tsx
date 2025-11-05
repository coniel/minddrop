import {
  Events,
  OpenConfirmationDialog,
  OpenConfirmationDialogData,
} from '@minddrop/events';
import { PropertyEditor } from '@minddrop/feature-properties';
import { ItemTypes } from '@minddrop/item-types';
import { PropertySchema } from '@minddrop/properties';

export interface ItemTypePropertyEditorProps {
  /**
   * The item type to which the property belongs.
   */
  itemType: string;

  /**
   * The property to edit.
   */
  property: PropertySchema;

  /**
   * Whether the property is a draft.
   * Draft properties are new properties that have not yet been saved.
   * @default false
   */
  isDraft?: boolean;

  /**
   * Callback fired when a draft property is saved.
   */
  onSaveDraft?: () => void;

  /**
   * Callback fired when a draft property is cancelled.
   */
  onCancelDraft?: () => void;
}

export const ItemTypePropertyEditor: React.FC<ItemTypePropertyEditorProps> = ({
  itemType,
  property,
  isDraft = false,
  onSaveDraft,
  onCancelDraft,
}) => {
  function validateName(name: string): string | undefined {
    const i18nRoot = 'properties.form.name.validation';

    // Name has not changed and is therefore valid
    if (!isDraft && name === property.name) {
      return;
    }

    // Name is required
    if (name.trim() === '') {
      return `${i18nRoot}.required`;
    }

    // Check for name conflicts
    const itemTypeConfig = ItemTypes.get(itemType);
    const existingProperty = itemTypeConfig?.properties.find(
      (property) => property.name === name,
    );

    if (existingProperty) {
      return `${i18nRoot}.nameConflict`;
    }

    // Check for invalid characters
    if (!/^[a-zA-Z_][a-zA-Z0-9_ -]*$/.test(name)) {
      return `${i18nRoot}.invalidCharacters`;
    }
  }

  function handleSaveDraft(newProperty: PropertySchema) {
    ItemTypes.addProperty(itemType, newProperty);

    if (onSaveDraft) {
      onSaveDraft();
    }

    return true;
  }

  async function handleSaveUpdate(updatedProperty: PropertySchema) {
    return new Promise<boolean>((resolve) => {
      if (updatedProperty.name !== property.name) {
        const i18nRoot = 'properties.actions.rename.confirmation';
        Events.dispatch<OpenConfirmationDialogData>(OpenConfirmationDialog, {
          title: `${i18nRoot}.title`,
          message: `${i18nRoot}.message`,
          confirmLabel: `${i18nRoot}.confirm`,
          onConfirm: () => {
            // TODO: Implement renameProperty method
            // ItemTypes.renameProperty(
            //   itemType,
            //   property.name,
            //   updatedProperty.name,
            // );
            ItemTypes.updateProperty(itemType, {
              ...updatedProperty,
              name: property.name,
            });
            resolve(true);
          },
          onCancel: () => {
            resolve(false);
          },
        });
      } else {
        ItemTypes.updateProperty(itemType, updatedProperty);
        resolve(true);
      }
    });
  }

  async function handleSave(property: PropertySchema) {
    if (isDraft) {
      return handleSaveDraft(property);
    }

    return handleSaveUpdate(property);
  }

  function handleDelete(propertyToDelete: PropertySchema) {
    const i18nRoot = 'properties.actions.delete.confirmation';

    Events.dispatch(OpenConfirmationDialog, {
      title: `${i18nRoot}.title`,
      message: `${i18nRoot}.message`,
      confirmLabel: `${i18nRoot}.confirm`,
      danger: true,
      onConfirm: () => {
        ItemTypes.removeProperty(itemType, propertyToDelete.name);
      },
    });
  }

  return (
    <PropertyEditor
      defaultOpen={isDraft}
      deletable={!isDraft}
      onDelete={handleDelete}
      onSave={handleSave}
      onCancel={onCancelDraft}
      property={property}
      validators={{ name: validateName }}
    />
  );
};
