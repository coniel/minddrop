import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { PropertySchema } from '@minddrop/properties';
import { render, screen, userEvent } from '@minddrop/test-utils';
import { SearchableMenu } from '@minddrop/ui-primitives';
import { cleanup, setup } from '../test-utils';
import { PropertyMenuItems } from './PropertyMenuItems';

const properties: PropertySchema[] = [
  { type: 'text', name: 'Title' },
  { type: 'select', name: 'Status', options: [] },
];

describe('<PropertyMenuItems />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('reports the picked property', async () => {
    const user = userEvent.setup();
    let picked: PropertySchema | undefined;

    render(
      <SearchableMenu>
        <PropertyMenuItems
          properties={properties}
          onSelect={(property) => {
            picked = property;
          }}
        />
      </SearchableMenu>,
    );

    await user.click(screen.getByText('Status'));

    expect(picked).toEqual(properties[1]);
  });
});
