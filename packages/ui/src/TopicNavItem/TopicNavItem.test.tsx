import React from 'react';
import {
  render,
  renderHook,
  cleanup,
  screen,
  act,
  fireEvent,
} from '@minddrop/test-utils';
import { useTranslation } from '@minddrop/i18n';
import { TopicNavItem } from './TopicNavItem';

describe('<TopicNavItem />', () => {
  afterEach(cleanup);

  it('renders the label', () => {
    render(<TopicNavItem label="Sailing" />);

    screen.getByText('Sailing');
  });

  it('renders "Untitled" when the topic has no label', () => {
    const { result } = renderHook(() => useTranslation());
    render(<TopicNavItem label="" />);

    const untitled = result.current.t('untitled');
    screen.getByText(untitled);
  });

  it('supports defaultExpanded', () => {
    render(
      <TopicNavItem defaultExpanded label="topic">
        <TopicNavItem label="subtopic" />
      </TopicNavItem>,
    );

    screen.getByText('subtopic');
  });

  it('expanded state can be controlled', () => {
    const onExpandedChange = jest.fn();

    render(
      <TopicNavItem expanded label="topic" onExpandedChange={onExpandedChange}>
        <TopicNavItem label="subtopic" />
      </TopicNavItem>,
    );

    screen.getByText('subtopic');

    act(() => {
      const toggleButton = screen.getAllByLabelText('Expand subtopics')[0];
      fireEvent.click(toggleButton);
    });

    expect(onExpandedChange).toHaveBeenCalled();
  });

  it('can be clicked', () => {
    const onClick = jest.fn();

    render(<TopicNavItem label="topic" onClick={onClick} />);

    act(() => {
      fireEvent.click(screen.getByText('topic'));
    });

    expect(onClick).toHaveBeenCalled();
  });

  it('supports being active', () => {
    render(<TopicNavItem label="topic" active />);

    screen.getByRole('button', { current: true });
  });
});
