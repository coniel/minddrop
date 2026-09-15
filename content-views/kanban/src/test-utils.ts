import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { SelectPropertySchema } from '@minddrop/properties';

const { entryTemplatesDatabase } = DatabaseFixtures;

// The database fixture's 'Status' select property, offering the
// 'Todo' and 'Done' options.
export const statusProperty = entryTemplatesDatabase.properties.find(
  (property): property is SelectPropertySchema => property.type === 'select',
)!;

// A multi-select variant of the fixture's 'Status' property
export const multiselectStatusProperty: SelectPropertySchema = {
  ...statusProperty,
  multiselect: true,
};
