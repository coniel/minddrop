import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseFixtures, Databases } from '@minddrop/databases';
import {
  CreatedPropertySchema,
  TextPropertySchema,
} from '@minddrop/properties';
import { render, screen, userEvent, waitFor } from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { DatabasePropertiesEditor } from './DatabasePropertiesEditor';

const { objectDatabase, noPropertiesDatabase } = DatabaseFixtures;

describe('<DatabasePropertiesEditor />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('renders the database properties list', () => {
    const { getByText } = render(
      <DatabasePropertiesEditor name={objectDatabase.name} />,
    );

    objectDatabase.properties.forEach((property) => {
      getByText(property.name);
    });
  });

  describe('draft properties', () => {
    async function addDraftProperty() {
      const user = userEvent.setup();

      render(<DatabasePropertiesEditor name={noPropertiesDatabase.name} />);

      // Open the property type selection menu
      await user.click(screen.getByLabelText('databases.actions.addProperty'));

      // Wait for the menu to open
      await waitFor(() => {
        screen.getByText(TextPropertySchema.name);
      });

      // Select the "Text" property type
      await user.click(screen.getByText(TextPropertySchema.name));
    }

    it('adds new properties as drafts', async () => {
      await addDraftProperty();

      // Check that the draft property was added bt looking for an open
      // property editor.
      expect(screen.getByLabelText('properties.form.name.label')).toBeVisible();
    });

    it('removes draft property on cancel', async () => {
      const user = userEvent.setup();

      await addDraftProperty();

      // Cancel the draft property
      await user.click(screen.getByText('actions.cancel'));

      // Check that the draft property was removed by looking for the
      // property name input, which should no longer be in the document.
      expect(
        screen.queryByLabelText('properties.form.name.label'),
      ).not.toBeInTheDocument();
    });

    it('removes draft property on save', async () => {
      const user = userEvent.setup();

      await addDraftProperty();

      // Save the draft property
      await user.click(screen.getByText('actions.save'));

      // Check that the draft property was removed by looking for the
      // property name input, which should no longer be in the document.
      expect(
        screen.queryByLabelText('properties.form.name.label'),
      ).not.toBeVisible();
    });
  });

  describe('property type selection menu', () => {
    it('omits meta properties if already present', async () => {
      const user = userEvent.setup();

      // Add the "Created" meta property to the database
      await Databases.addProperty(
        noPropertiesDatabase.name,
        CreatedPropertySchema,
      );

      render(<DatabasePropertiesEditor name={noPropertiesDatabase.name} />);

      // Open the property type selection menu
      await user.click(screen.getByLabelText('databases.actions.addProperty'));

      // Wait for the menu to open
      await waitFor(() => {
        screen.getByText(TextPropertySchema.name);
      });

      const menuItems = screen.getAllByRole('menuitem');

      // Check that the "Created" meta property menu item is not present
      expect(
        menuItems.find(
          (item) => item.textContent === CreatedPropertySchema.name,
        ),
      ).toBeUndefined();
    });

    it('omits meta properties if present as a draft', async () => {
      const user = userEvent.setup();
      render(<DatabasePropertiesEditor name={noPropertiesDatabase.name} />);

      // Open the property type selection menu
      await user.click(screen.getByLabelText('databases.actions.addProperty'));

      // Wait for the menu to open
      await waitFor(() => {
        screen.getByText(TextPropertySchema.name);
      });

      // Add the "Created" meta property as a draft
      await user.click(screen.getByText(CreatedPropertySchema.name));

      // Re-open the property type selection menu
      await user.click(screen.getByLabelText('databases.actions.addProperty'));

      // Wait for the menu to open
      await waitFor(() => {
        screen.getByText(TextPropertySchema.name);
      });

      const menuItems = screen.getAllByRole('menuitem');

      // Check that the "Created" meta property menu item is not present
      expect(
        menuItems.find(
          (item) => item.textContent === CreatedPropertySchema.name,
        ),
      ).toBeUndefined();
    });
  });
});
