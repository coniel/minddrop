import React from 'react';
import {
  render,
  cleanup as cleanupRender,
  act,
  fireEvent,
} from '@minddrop/test-utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTopicSelectionItem,
  DropdownMenuTrigger,
} from '@minddrop/ui';
import { TOPICS_TEST_DATA } from '@minddrop/topics';
import { cleanup, setup } from '../test-utils';
import {
  TopicSelectionMenu,
  TopicSelectionMenuProps,
} from './TopicSelectionMenu';

const { tSailing, tBoats, tNavigation } = TOPICS_TEST_DATA;

describe('<TopicSelectionMenu />', () => {
  beforeEach(() => {
    setup();
  });

  afterEach(() => {
    cleanupRender();
    cleanup();
  });

  const init = (props?: Partial<TopicSelectionMenuProps>) => {
    const utils = render(
      <DropdownMenu>
        <DropdownMenuTrigger>
          <button type="button">trigger</button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <TopicSelectionMenu
            MenuItemComponent={DropdownMenuTopicSelectionItem}
            {...props}
          />
          ,
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    return utils;
  };

  it('uses app root topics as root topics by default', () => {
    const { getByText } = init();

    act(() => {
      // Open the dropdown menu
      fireEvent.click(getByText('trigger'));
    });

    // Should render app root level topics
    getByText(tSailing.title);
  });

  it('uses provided root topics as root topics', () => {
    // Render with provided root level topics
    const { getByText } = init({ rootTopicIds: [tNavigation.id] });

    act(() => {
      // Open the dropdown menu
      fireEvent.click(getByText('trigger'));
    });

    // Should render provided root level topics
    getByText(tNavigation.title);
  });

  it('renders subtopics', () => {
    const { getByText, getAllByLabelText } = init();

    act(() => {
      // Open the dropdown menu
      fireEvent.click(getByText('trigger'));
    });

    act(() => {
      // Expand the first topic
      fireEvent.click(getAllByLabelText('Expand subtopics')[0]);
    });

    // Should render the first topic's subtopics
    expect(getByText(tBoats.title));
  });

  it('excludes `excludeTopicIds`', () => {
    // Render with topic 'Sailing' being excluded
    const { getByText, queryByText } = init({ excludeTopicIds: [tSailing.id] });

    act(() => {
      // Open the dropdown menu
      fireEvent.click(getByText('trigger'));
    });

    // Should not render 'Sailing' topic
    expect(queryByText(tSailing.title)).toBeNull();
  });

  it('calls `onSelect` when selecting a topic', () => {
    const onSelect = jest.fn();

    // Render with an onSelect callback
    const { getByText } = init({ onSelect });

    act(() => {
      // Open the dropdown menu
      fireEvent.click(getByText('trigger'));
    });

    act(() => {
      // Click the 'Sailing' topic
      fireEvent.click(getByText(tSailing.title));
    });

    // Should call `onSelect` with the topic ID
    expect(onSelect).toHaveBeenCalledWith(expect.anything(), tSailing.id);
  });
});
