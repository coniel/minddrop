import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { cleanup, render } from '@minddrop/test-utils';
import { VirtualizedList } from './VirtualizedList';

// Items used across the tests
const items = Array.from({ length: 100 }, (_, index) => `item-${index}`);

// Renders an item's label
const renderItem = (item: string) => <span>{item}</span>;

// The stubbed viewport height, the test environment does not
// lay elements out
const VIEWPORT_HEIGHT = 100;

describe('<VirtualizedList />', () => {
  const offsetHeight = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'offsetHeight',
  );

  // Give the scroll viewport a height, without which the
  // virtualizer renders no rows at all
  beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      get: () => VIEWPORT_HEIGHT,
    });
  });

  // Restore the environment's own layout behaviour
  afterAll(() => {
    if (offsetHeight) {
      Object.defineProperty(
        HTMLElement.prototype,
        'offsetHeight',
        offsetHeight,
      );
    }
  });

  afterEach(cleanup);

  it('renders only a subset of the items', () => {
    const { queryAllByText } = render(
      <VirtualizedList items={items} itemHeight={32} renderItem={renderItem} />,
    );

    // The first item is rendered
    expect(queryAllByText('item-0').length).toBe(1);

    // Items well beyond the overscan window are not
    expect(queryAllByText('item-99').length).toBe(0);
  });

  it('renders nothing when there are no items', () => {
    const { container } = render(
      <VirtualizedList items={[]} itemHeight={32} renderItem={renderItem} />,
    );

    expect(container.firstChild).toBe(null);
  });

  it('sets list position attributes on the rows', () => {
    const { getByText } = render(
      <VirtualizedList items={items} itemHeight={32} renderItem={renderItem} />,
    );

    const row = getByText('item-1').parentElement;

    expect(row).toHaveAttribute('aria-setsize', '100');
    expect(row).toHaveAttribute('aria-posinset', '2');
    expect(row).toHaveAttribute('data-index', '1');
  });

  it('renders no rows when disabled', () => {
    const { queryAllByText } = render(
      <VirtualizedList
        enabled={false}
        items={items}
        itemHeight={32}
        renderItem={renderItem}
      />,
    );

    expect(queryAllByText('item-0').length).toBe(0);
  });

  it('supports per-item heights', () => {
    const { getByText } = render(
      <VirtualizedList
        items={items}
        itemHeight={(_item, index) => (index === 0 ? 64 : 32)}
        renderItem={renderItem}
      />,
    );

    // The second row is offset by the first row's height
    expect(getByText('item-1').parentElement).toHaveStyle({
      transform: 'translateY(64px)',
    });
  });
});
