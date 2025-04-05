import {
  CollectionCheckboxPropertySchema,
  Collections,
} from '@minddrop/collections';
import { CheckboxInput, FieldLabel, Stack } from '@minddrop/ui-elements';

export interface CheckboxPropertyOptionsProps {
  /**,
   * Path to the collection to which the checkbox property
   * belongs.
   */
  collectionPath: string;

  /**
   * The checkbox property schema.
   */
  schema: CollectionCheckboxPropertySchema;

  /**
   * The name of the checkbox property.
   */
  name: string;
}

export const CheckboxPropertyOptions: React.FC<
  CheckboxPropertyOptionsProps
> = ({ collectionPath, schema, name }) => {
  function handleDefaultCheckedChange(checked: boolean) {
    Collections.updateProperty(collectionPath, name, {
      ...schema,
      defaultChecked: checked,
    });
  }

  return (
    <Stack>
      <Stack gap="xs">
        <FieldLabel
          htmlFor="default-checked"
          label="properties.checkbox.defaultValue.label"
        />
        <CheckboxInput
          name="default-checked"
          onCheckedChange={handleDefaultCheckedChange}
          checked={schema.defaultChecked}
          label={`properties.checkbox.defaultValue.${schema.defaultChecked ? 'checked' : 'unchecked'}`}
        />
      </Stack>
    </Stack>
  );
};
