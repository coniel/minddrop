import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { PropertySchema } from '@minddrop/properties';
import { render, screen, userEvent } from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { PropertyPickerPopover } from './PropertyPickerPopover';

const properties: PropertySchema[] = [
  { type: 'text', name: 'Title' },
  { type: 'select', name: 'Status', options: [] },
];

describe('<PropertyPickerPopover />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('lists the properties with a search field', async () => {
    render(
      <PropertyPickerPopover
        anchor={null}
        open
        onOpenChange={() => {}}
        properties={properties}
        onSelect={() => {}}
      />,
    );

    expect(
      await screen.findByPlaceholderText('Search properties'),
    ).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('reports the picked property', async () => {
    const user = userEvent.setup();
    let picked: PropertySchema | undefined;

    render(
      <PropertyPickerPopover
        anchor={null}
        open
        onOpenChange={() => {}}
        properties={properties}
        onSelect={(property) => {
          picked = property;
        }}
      />,
    );

    await user.click(await screen.findByText('Status'));

    expect(picked).toEqual(properties[1]);
  });
});
