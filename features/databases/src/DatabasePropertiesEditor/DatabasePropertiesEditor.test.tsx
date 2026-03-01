import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseFixtures } from '@minddrop/databases';
import { render } from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { DatabasePropertiesEditor } from './DatabasePropertiesEditor';

const { objectDatabase } = DatabaseFixtures;

describe('<DatabasePropertiesEditor />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('renders the database properties list', () => {
    const { getByText } = render(
      <DatabasePropertiesEditor
        databaseId={objectDatabase.id}
        draftProperties={[]}
        onSaveDraft={() => {}}
        onCancelDraft={() => {}}
      />,
    );

    objectDatabase.properties.forEach((property) => {
      getByText(property.name);
    });
  });
});
