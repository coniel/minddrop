import { afterEach, describe, expect, it, vi } from 'vitest';
import { initializeI18n } from '@minddrop/i18n';
import { fireEvent, render } from '@minddrop/test-utils';
import { cleanup } from '../test-utils';
import { EditorReference } from '../types';
import { LinkMenu } from './LinkMenu';

initializeI18n();

// The position of the text the link is made from. jsdom provides no DOMRect
// constructor, so the measured rect is stood in for by its shape.
const anchor = {
  rect: {
    x: 10,
    y: 20,
    top: 20,
    left: 10,
    right: 110,
    bottom: 36,
    width: 100,
    height: 16,
    toJSON: () => ({}),
  } as DOMRect,
  fontSize: '16px',
  color: 'rgb(0, 0, 0)',
};

const references: EditorReference[] = [
  { reference: 'Book', label: 'Book', description: 'Books' },
  { reference: 'Today', label: 'Today', description: 'Notes' },
];

const renderMenu = (props: Partial<React.ComponentProps<typeof LinkMenu>>) =>
  render(
    <LinkMenu
      anchor={anchor}
      query=""
      references={references}
      onQueryChange={vi.fn()}
      onSelectReference={vi.fn()}
      onSelectUrl={vi.fn()}
      onClose={vi.fn()}
      {...props}
    />,
  );

describe('LinkMenu', () => {
  afterEach(cleanup);

  it('is not shown when closed', () => {
    const { queryByText } = renderMenu({ anchor: null });

    expect(queryByText('Book')).toBeNull();
  });

  it('lists the references it is given', async () => {
    const { findByText } = renderMenu({});

    await findByText('Book');
    await findByText('Today');
  });

  it('describes what each reference belongs to', async () => {
    const { findByText } = renderMenu({});

    await findByText('Books');
  });

  it('chooses a reference when it is pressed', async () => {
    const onSelectReference = vi.fn();
    const { findByText } = renderMenu({ onSelectReference });

    fireEvent.click(await findByText('Book'));

    expect(onSelectReference).toHaveBeenCalledWith(references[0]);
  });

  it('offers a web address typed into the field', async () => {
    const { findAllByText } = renderMenu({ query: 'https://minddrop.app' });

    // While searching, the menu renders its items from its own registry as
    // well as keeping the source items hidden, so each appears twice
    expect(await findAllByText('https://minddrop.app')).not.toHaveLength(0);
    expect(await findAllByText('Link to webpage')).not.toHaveLength(0);
  });

  it('lists no references while a web address is offered', async () => {
    const { queryByText, findAllByText } = renderMenu({
      query: 'https://minddrop.app',
    });

    await findAllByText('https://minddrop.app');

    expect(queryByText('Book')).toBeNull();
  });

  it('chooses the web address when it is pressed', async () => {
    const onSelectUrl = vi.fn();
    const { findAllByText } = renderMenu({
      query: 'https://minddrop.app',
      onSelectUrl,
    });

    // The listed item is the one the menu renders, the other being the
    // hidden source it was registered from
    const [, listed] = await findAllByText('https://minddrop.app');

    fireEvent.click(listed);

    expect(onSelectUrl).toHaveBeenCalledWith('https://minddrop.app');
  });

  it('says so when a search matches nothing', async () => {
    const { findByText } = renderMenu({ query: 'nothing', references: [] });

    await findByText('No matching entries');
  });
});
