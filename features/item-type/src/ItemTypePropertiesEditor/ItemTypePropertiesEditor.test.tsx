import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ItemTypes, ItemTypesFixtures } from '@minddrop/item-types';
import {
  CreatedPropertySchema,
  TextPropertySchema,
} from '@minddrop/properties';
import { render, screen, userEvent, waitFor } from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { ItemTypePropertiesEditor } from './ItemTypePropertiesEditor';

const { urlItemTypeConfig, noPropertiesItemTypeConfig } = ItemTypesFixtures;

describe('<ItemTypePropertiesEditor />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('renders the item type properties list', () => {
    const { getByText } = render(
      <ItemTypePropertiesEditor itemType={urlItemTypeConfig.nameSingular} />,
    );

    urlItemTypeConfig.properties.forEach((property) => {
      getByText(property.name);
    });
  });

  describe('draft properties', () => {
    async function addDraftProperty() {
      const user = userEvent.setup();

      render(
        <ItemTypePropertiesEditor
          itemType={noPropertiesItemTypeConfig.nameSingular}
        />,
      );

      // Open the property type selection menu
      await user.click(screen.getByLabelText('itemTypes.actions.addProperty'));

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

      // Add the "Created" meta property to the item type
      await ItemTypes.addProperty(
        noPropertiesItemTypeConfig.nameSingular,
        CreatedPropertySchema,
      );

      render(
        <ItemTypePropertiesEditor
          itemType={noPropertiesItemTypeConfig.nameSingular}
        />,
      );

      // Open the property type selection menu
      await user.click(screen.getByLabelText('itemTypes.actions.addProperty'));

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
      render(
        <ItemTypePropertiesEditor
          itemType={noPropertiesItemTypeConfig.nameSingular}
        />,
      );

      // Open the property type selection menu
      await user.click(screen.getByLabelText('itemTypes.actions.addProperty'));

      // Wait for the menu to open
      await waitFor(() => {
        screen.getByText(TextPropertySchema.name);
      });

      // Add the "Created" meta property as a draft
      await user.click(screen.getByText(CreatedPropertySchema.name));

      // Re-open the property type selection menu
      await user.click(screen.getByLabelText('itemTypes.actions.addProperty'));

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
