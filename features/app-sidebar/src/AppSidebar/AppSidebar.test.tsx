import { afterEach, describe, it } from 'vitest';
import { Events } from '@minddrop/events';
import { ItemTypes, ItemTypesFixtures } from '@minddrop/item-types';
import { cleanup, render } from '@minddrop/test-utils';
import { AppSidebar } from './AppSidebar';

describe('<AppSidebar />', () => {
  afterEach(cleanup);

  describe('items', () => {
    it('renders user item types', () => {
      ItemTypes.Store.load(ItemTypesFixtures.itemTypeConfigs);

      const { getByText } = render(<AppSidebar className="my-class" />);

      getByText(ItemTypesFixtures.itemTypeConfigs[0].namePlural);
    });

    it('opens new item type dialog', async () =>
      new Promise<void>((done) => {
        Events.addListener(
          'item-types:new-item-type-dialog:open',
          'test',
          () => {
            done();
          },
        );

        const { getByText } = render(<AppSidebar className="my-class" />);

        const addButton = getByText('itemTypes.actions.add');
        addButton.click();
      }));
  });
});
