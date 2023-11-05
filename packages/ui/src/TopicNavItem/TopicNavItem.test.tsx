import { describe, afterEach, expect, it, vi } from 'vitest';
import { render, cleanup, screen, act, fireEvent } from '@minddrop/test-utils';
import { TopicNavItem } from './TopicNavItem';

describe('<TopicNavItem />', () => {
  afterEach(cleanup);

  it('renders the label', () => {
    render(<TopicNavItem label="Sailing" />);

    screen.getByText('Sailing');
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
    const onExpandedChange = vi.fn();

    render(
      <TopicNavItem expanded label="topic" onExpandedChange={onExpandedChange}>
        <TopicNavItem label="subtopic" />
      </TopicNavItem>,
    );

    screen.getByText('subtopic');

    act(() => {
      const toggleButton = screen.getAllByLabelText('expandSubtopics')[0];
      fireEvent.click(toggleButton);
    });

    expect(onExpandedChange).toHaveBeenCalled();
  });

  it('can be clicked', () => {
    const onClick = vi.fn();

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
