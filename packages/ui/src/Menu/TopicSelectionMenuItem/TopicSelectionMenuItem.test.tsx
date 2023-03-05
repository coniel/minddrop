import React from 'react';
import { describe, afterEach, it, expect, vi } from 'vitest';
import {
  render,
  renderHook,
  cleanup,
  screen,
  act,
  fireEvent,
} from '@minddrop/test-utils';
import { useTranslation } from '@minddrop/i18n';
import {
  TopicSelectionMenuItem as TopicSelectionMenuItemPrimitive,
  TopicSelectionMenuItemProps,
} from './TopicSelectionMenuItem';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';

const TopicSelectionMenuItem: React.FC<
  Omit<TopicSelectionMenuItemProps, 'MenuItemComponent'>
> = (props) => (
  <TopicSelectionMenuItemPrimitive
    {...props}
    MenuItemComponent={DropdownMenuItem}
  />
);

const baseItem: Omit<TopicSelectionMenuItemProps, 'MenuItemComponent'> = {
  label: 'topic',
  onSelect: vi.fn(),
};

describe('<TopicSelectionMenuItem />', () => {
  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  const renderItem = (
    props: Omit<TopicSelectionMenuItemProps, 'MenuItemComponent'>,
  ) =>
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>
          <div />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <TopicSelectionMenuItem {...props} />
        </DropdownMenuContent>
      </DropdownMenu>,
    );

  it('renders the label', () => {
    renderItem({ ...baseItem, label: 'Sailing' });

    screen.getByText('Sailing');
  });

  it('renders "Untitled" when the topic has no label', () => {
    const { result } = renderHook(() => useTranslation());
    renderItem({ ...baseItem, label: '' });

    const unlabeld = result.current.t('untitled');
    screen.getByText(unlabeld);
  });

  it('renders subtopics', () => {
    renderItem({
      ...baseItem,
      defaultExpanded: true,
      children: <TopicSelectionMenuItem label="subtopic" />,
    });

    screen.getByText('subtopic');
  });

  it('toggles expanded', () => {
    renderItem({
      ...baseItem,
      children: <TopicSelectionMenuItem label="subtopic" />,
    });

    const toggleButton = screen.getAllByLabelText('Expand subtopics')[0];

    act(() => {
      fireEvent.click(toggleButton);
    });

    screen.getByText('subtopic');

    act(() => {
      fireEvent.click(toggleButton);
    });

    expect(screen.queryByText('subtopic')).toBe(null);
  });

  it('toggles expanded using arrow keys', () => {
    renderItem({
      ...baseItem,
      children: <TopicSelectionMenuItem label="subtopic" />,
    });

    const item = screen.getByText('topic');

    act(() => {
      fireEvent.keyDown(item, { key: 'ArrowRight' });
    });

    screen.getByText('subtopic');

    act(() => {
      fireEvent.keyDown(item, { key: 'ArrowLeft' });
    });

    expect(screen.queryByText('subtopic')).toBe(null);
  });

  it('can be clicked', () => {
    const onSelect = vi.fn();

    renderItem({ ...baseItem, onSelect });

    act(() => {
      fireEvent.click(screen.getByText('topic'));
    });

    expect(onSelect).toHaveBeenCalled();
  });

  it('can be selected with keyboard', () => {
    const onSelect = vi.fn();

    renderItem({ ...baseItem, onSelect });

    act(() => {
      fireEvent.keyDown(screen.getByText('topic'), {
        key: 'Enter',
        code: 'Enter',
        charCode: 13,
      });
    });

    expect(onSelect).toHaveBeenCalled();
  });
});
