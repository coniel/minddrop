import { afterEach, describe, expect, it, vi } from 'vitest';
import { initializeI18n } from '@minddrop/i18n';
import { fireEvent, render } from '@minddrop/test-utils';
import { cleanup } from '../test-utils';
import { EditorReference } from '../types';
import { ReferenceMenu } from './ReferenceMenu';

initializeI18n();

// The position of the trigger text. jsdom provides no DOMRect constructor,
// so the measured rect is stood in for by its shape.
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

const renderMenu = (
  props: Partial<React.ComponentProps<typeof ReferenceMenu>>,
) =>
  render(
    <ReferenceMenu
      open
      onOpenChange={vi.fn()}
      anchor={anchor}
      showHint={false}
      references={references}
      activeIndex={0}
      onHighlight={vi.fn()}
      onSelect={vi.fn()}
      {...props}
    />,
  );

describe('ReferenceMenu', () => {
  afterEach(cleanup);

  it('is not shown when closed', () => {
    const { queryByText } = renderMenu({ open: false });

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

  it('selects a reference when it is pressed', async () => {
    const onSelect = vi.fn();
    const { findByText } = renderMenu({ onSelect });

    fireEvent.click(await findByText('Today'));

    expect(onSelect).toHaveBeenCalledWith(1);
  });

  it('prompts for a query until one is typed', async () => {
    const { findByText } = renderMenu({ showHint: true });

    await findByText('Search entries');
  });
});
