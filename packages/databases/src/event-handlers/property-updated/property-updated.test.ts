import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { History } from '@minddrop/history';
import { SelectPropertySchema } from '@minddrop/properties';
import { DatabaseFixtures, cleanup, setup } from '../../test-utils';
import { resolveDatabaseHistorySubject } from '../../utils';
import { onUpdateProperty } from './property-updated';

const {
  entryTemplatesDatabase,
  historyAction_propertyUpdated: action,
  statusProperty,
} = DatabaseFixtures;

// The status property with its 'Done' option recoloured
const recolouredProperty: SelectPropertySchema = {
  ...statusProperty,
  options: statusProperty.options.map((option) =>
    option.value === 'Done' ? { ...option, color: 'red' } : option,
  ),
};

describe('onUpdateProperty', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("records the property's definition before and after against the database's history", async () => {
    // Call the handler
    await onUpdateProperty({
      original: entryTemplatesDatabase,
      updated: {
        ...entryTemplatesDatabase,
        properties: entryTemplatesDatabase.properties.map((property) =>
          property.name === statusProperty.name ? recolouredProperty : property,
        ),
      },
      originalProperty: statusProperty,
      updatedProperty: recolouredProperty,
      action,
    });

    // The database's history should hold the property's definition
    // before and after the update.
    expect(
      await History.read(resolveDatabaseHistorySubject(entryTemplatesDatabase)),
    ).toEqual([
      expect.objectContaining({
        kind: 'definition',
        changes: [
          {
            part: statusProperty.name,
            from: statusProperty,
            to: recolouredProperty,
          },
        ],
        action,
      }),
    ]);
  });
});
