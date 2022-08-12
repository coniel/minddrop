import React from 'react';
import {
  render,
  cleanup as cleanupRender,
  screen,
  act,
  fireEvent,
  waitFor,
} from '@minddrop/test-utils';
import { i18n } from '@minddrop/i18n';
import { App } from '@minddrop/app';
import { Topics, TOPICS_TEST_DATA } from '@minddrop/topics';
import { DROPS_TEST_DATA } from '@minddrop/drops';
import { Selection } from '@minddrop/selection';
import { TopicNavItem } from './TopicNavItem';
import { setup, cleanup, core } from '../test-utils';

const {
  tSailing,
  tNavigation,
  tBoats,
  tAnchoring,
  tCoastalNavigationView,
  tCoastalNavigation,
  trail,
  tUntitled,
  rootTopicIds,
} = TOPICS_TEST_DATA;
const { drop1 } = DROPS_TEST_DATA;

const dataTransferEvent = {
  preventDefault: jest.fn(),
  dataTransfer: {
    types: [],
    files: [],
    data: {},
    getData: (type: string) => dataTransferEvent.dataTransfer.data[type],
    setData: (type: string, value: string) => {
      // Add the type to the types list
      dataTransferEvent.dataTransfer.types.push(type);
      // Add the data
      dataTransferEvent.dataTransfer.data[type] = value;
    },
  },
};

const dragEvent = dataTransferEvent as unknown as DragEvent;

describe('<TopicNavItem />', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanupRender();
    cleanup();

    // Reset the drag event
    dataTransferEvent.dataTransfer.data = [];
    dataTransferEvent.dataTransfer.types = [];
  });

  it('renders the title', () => {
    render(<TopicNavItem trail={trail} />);

    screen.getByText(tCoastalNavigation.title);
  });

  it('renders subtopics when expanded', () => {
    render(<TopicNavItem trail={[tSailing.id]} />);

    act(() => {
      // Expand topic by clicking on toggle button
      const label = i18n.t('expandSubtopics');
      fireEvent.click(screen.getByLabelText(label));
    });

    screen.getByText(tNavigation.title);
    screen.getByText(tBoats.title);
    screen.getByText(tAnchoring.title);
  });

  it('opens topic view when clicked', () => {
    render(<TopicNavItem trail={trail} />);

    act(() => {
      fireEvent.click(screen.getByText(tCoastalNavigation.title));
    });

    const { view, instance } = App.getCurrentView();
    expect(view.id).toBe('minddrop:topic-view:columns');
    expect(instance.id).toBe(tCoastalNavigationView.id);
  });

  it('expands subtopics when adding a subtopic', async () => {
    render(<TopicNavItem trail={[tSailing.id]} />);

    // Open context menu
    fireEvent.contextMenu(screen.getByText(tSailing.title));

    // Wait for menu to open
    const addSubtopic = i18n.t('addSubtopic');
    await waitFor(() => screen.getAllByText(addSubtopic));
    // Click 'Add subtopic'
    act(() => {
      fireEvent.click(screen.getByText(addSubtopic));
    });

    screen.getByText(tNavigation.title);
  });

  it('opens the new suptopic view when adding a subtopic', async () => {
    render(<TopicNavItem trail={trail} />);

    // Open context menu
    fireEvent.contextMenu(screen.getByText(tCoastalNavigation.title));

    // Wait for menu to open
    const addSubtopic = i18n.t('addSubtopic');
    await waitFor(() => screen.getAllByText(addSubtopic));
    // Click 'Add subtopic'
    act(() => {
      fireEvent.click(screen.getByText(addSubtopic));
    });

    const { view, instance } = App.getCurrentView();
    const subtopicId = Topics.get(tCoastalNavigation.id).subtopics.slice(-1)[0];
    const subtopic = Topics.get(subtopicId);
    expect(view.id).toBe('minddrop:topic-view:columns');
    expect(instance.id).toBe(subtopic.views[0]);
  });

  it('opens the rename popover when clicking on Rename menu option', async () => {
    render(<TopicNavItem trail={trail} />);

    // Open context menu
    fireEvent.contextMenu(screen.getByText(tCoastalNavigation.title));

    // Click "Rename" menu item
    const rename = i18n.t('rename');
    await waitFor(() => screen.getAllByText(rename));
    fireEvent.click(screen.getByText(rename));

    // Check for rename popover input
    const input = i18n.t('topicName');
    screen.getByLabelText(input);
  });

  it('has active state if releveant topic view is open', () => {
    App.openTopicView(core, [tSailing.id]);

    render(<TopicNavItem trail={[tSailing.id]} />);

    screen.getByRole('button', { current: true });
  });

  describe('top drop target', () => {
    it('displayed when dragging topics', () => {
      const { getByTestId } = render(<TopicNavItem trail={[tSailing.id]} />);

      // Should not be visible by default
      expect(getByTestId('top-drop-target')).not.toHaveClass('displayed');

      act(() => {
        // Select a topic
        Selection.select(core, [Selection.item(tUntitled)]);
        // Initialize a drag event
        Selection.dragStart(core, dragEvent, 'sort');
      });

      // Should be visible
      expect(getByTestId('top-drop-target')).toHaveClass('displayed');

      act(() => {
        // End the drag event
        Selection.dragEnd(core, dragEvent);
      });

      // Should no longer be visible
      expect(getByTestId('top-drop-target')).not.toHaveClass('displayed');
    });

    it('not displayed when dragging topics with other items', () => {
      const { getByTestId } = render(<TopicNavItem trail={[tSailing.id]} />);

      act(() => {
        // Select a topic and a drop
        Selection.select(core, [
          Selection.item(tUntitled),
          Selection.item(drop1),
        ]);
        // Initialize a drag event
        Selection.dragStart(core, dragEvent, 'sort');
      });

      // Should not be visible
      expect(getByTestId('top-drop-target')).not.toHaveClass('displayed');
    });

    it('not displayed when dragging a topic onto iteslf', () => {
      const { getByTestId } = render(<TopicNavItem trail={[tSailing.id]} />);

      act(() => {
        // Select the topic itself
        Selection.select(core, [Selection.item(tSailing)]);
        // Initialize a drag event
        Selection.dragStart(core, dragEvent, 'sort');
      });

      // Should not be visible
      expect(getByTestId('top-drop-target')).not.toHaveClass('displayed');
    });

    it('not displayed when dragging a parent topic over a descendant', () => {
      // Render a deeply nested subtopic
      const { getByTestId } = render(
        <TopicNavItem
          trail={[tSailing.id, tNavigation.id, tCoastalNavigation.id]}
        />,
      );

      act(() => {
        // Select the topic's grandparent topic
        Selection.select(core, [Selection.item(tSailing)]);
        // Initialize a drag event
        Selection.dragStart(core, dragEvent, 'sort');
      });

      // Should not be visible
      expect(getByTestId('top-drop-target')).not.toHaveClass('displayed');
    });

    it('has `over` styling when dragging over', () => {
      const { getByTestId } = render(<TopicNavItem trail={[tSailing.id]} />);

      act(() => {
        // Select a topic
        Selection.select(core, [Selection.item(tUntitled)]);
        // Initialize a drag event
        Selection.dragStart(core, dragEvent, 'sort');
      });

      // Should not have 'over' styling by default
      expect(getByTestId('top-drop-target')).not.toHaveClass('over');

      act(() => {
        // Drag enter the top drop target
        fireEvent.dragEnter(getByTestId('top-drop-target'));
      });

      // Should have 'over' styling
      expect(getByTestId('top-drop-target')).toHaveClass('over');

      act(() => {
        // Drag leave the top drop target
        fireEvent.dragLeave(getByTestId('top-drop-target'));
      });

      // Should not have 'over' styling
      expect(getByTestId('top-drop-target')).not.toHaveClass('over');
    });

    it('does nothing if the dropped data does not exclusively consist of topics', () => {
      const { getByTestId } = render(
        <TopicNavItem trail={[rootTopicIds[0]]} />,
      );

      act(() => {
        // Select a topic and a drop
        Selection.select(core, [
          Selection.item(tUntitled),
          Selection.item(drop1),
        ]);
        // Initialize a drag event
        Selection.dragStart(core, dragEvent, 'sort');
      });

      act(() => {
        // Drop onto the top drop target
        fireEvent.drop(getByTestId('top-drop-target'), dragEvent);
      });

      // Root topics should not have changed
      expect(App.getRootTopics().map((topic) => topic.id)).toEqual(
        rootTopicIds,
      );
    });

    describe('root level topic', () => {
      it('sorts dropped root topics', () => {
        // Use the first root topic as the drop target and the
        // second and third root topics as the ones being dragged.
        const [targetTopic, draggedTopic1, draggedTopic2] = rootTopicIds;

        const { getByTestId } = render(<TopicNavItem trail={[targetTopic]} />);

        act(() => {
          // Select the two dragged root topics
          Selection.select(core, [
            Selection.item(Topics.get(draggedTopic1)),
            Selection.item(Topics.get(draggedTopic2)),
          ]);
          // Initialize a drag event
          Selection.dragStart(core, dragEvent, 'sort');
        });

        act(() => {
          // Drop onto the top drop target
          fireEvent.drop(getByTestId('top-drop-target'), dragEvent);
        });

        // Get the updated root topic IDs
        const sortedRootTopics = App.getRootTopics().map((topic) => topic.id);

        // Dragged topics should be above target topic
        expect(sortedRootTopics[0]).toBe(draggedTopic1);
        expect(sortedRootTopics[1]).toBe(draggedTopic2);
        expect(sortedRootTopics[2]).toBe(targetTopic);
      });

      it('moves dropped subtopics to the root level', () => {
        // Use the first root topic as the drop target
        const [targetTopic] = rootTopicIds;
        // Use subtopics as the dragged topics
        const draggedTopic1 = tNavigation;
        const draggedTopic2 = tBoats;

        const { getByTestId } = render(<TopicNavItem trail={[targetTopic]} />);

        act(() => {
          // Select the two dragged root topics
          Selection.select(core, [
            Selection.item(draggedTopic1, draggedTopic1.parents[0]),
            Selection.item(draggedTopic2, draggedTopic2.parents[0]),
          ]);
          // Initialize a drag event
          Selection.dragStart(core, dragEvent, 'sort');
        });

        act(() => {
          // Drop onto the top drop target
          fireEvent.drop(getByTestId('top-drop-target'), dragEvent);
        });

        // Get an updated dragged topics
        const updatedDraggedTopic = Topics.get(draggedTopic1.id);
        // Get the updated root topic IDs
        const updatedRootTopicIds = App.getRootTopics().map(
          (topic) => topic.id,
        );

        // Removes the dragged topics from their parent topic
        expect(updatedDraggedTopic.parents).toEqual([]);
        // Adds the dragged topics to the root level at the drop point
        expect(updatedRootTopicIds).toEqual([
          draggedTopic1.id,
          draggedTopic2.id,
          ...rootTopicIds,
        ]);
      });
    });

    describe('subtopic', () => {
      it('sorts dropped subtopics from the same parent', () => {
        // Use the first subtopic as the drop target and the
        // second and third subtopics as the ones being dragged.
        const [targetTopic, draggedTopic1, draggedTopic2] = tSailing.subtopics;

        const { getByTestId } = render(
          <TopicNavItem trail={[tSailing.id, targetTopic]} />,
        );

        act(() => {
          // Select the two dragged subtopics
          Selection.select(core, [
            Selection.item(Topics.get(draggedTopic1), tSailing),
            Selection.item(Topics.get(draggedTopic2), tSailing),
          ]);
          // Initialize a drag event
          Selection.dragStart(core, dragEvent, 'sort');
        });

        act(() => {
          // Drop onto the top drop target
          fireEvent.drop(getByTestId('top-drop-target'), dragEvent);
        });

        // Get the updated parent topic
        const parent = Topics.get(tSailing.id);

        // Dragged topics should be above target topic
        expect(parent.subtopics[0]).toBe(draggedTopic1);
        expect(parent.subtopics[1]).toBe(draggedTopic2);
        expect(parent.subtopics[2]).toBe(targetTopic);
      });

      it("moves subtopics from other parents into target's parent", () => {
        // The subtopics to move
        const [draggedTopic1, draggedTopic2] = tNavigation.subtopics;
        // The target subtopic
        const [targetTopic] = tSailing.subtopics;

        const { getByTestId } = render(
          <TopicNavItem trail={[tSailing.id, targetTopic]} />,
        );

        act(() => {
          // Select the two dragged subtopics
          Selection.select(core, [
            Selection.item(Topics.get(draggedTopic1), tNavigation),
            Selection.item(Topics.get(draggedTopic2), tNavigation),
          ]);
          // Initialize a drag event
          Selection.dragStart(core, dragEvent, 'sort');
        });

        act(() => {
          // Drop onto the top drop target
          fireEvent.drop(getByTestId('top-drop-target'), dragEvent);
        });

        // Get the updated source parent topic
        const sourceParent = Topics.get(tNavigation.id);
        // Get the updated target parent topic
        const targetParent = Topics.get(tSailing.id);

        // Dragged topics should be removed from source parent
        expect(sourceParent.subtopics.includes(draggedTopic1)).toBeFalsy();
        // Dragged topics should be added above target topic
        expect(targetParent.subtopics).toEqual([
          draggedTopic1,
          draggedTopic2,
          ...tSailing.subtopics,
        ]);
      });

      it("moves root topics into target's parent", () => {
        // The root topics to move
        const [draggedTopic1, draggedTopic2] = rootTopicIds.filter(
          (id) => id !== tSailing.id,
        );
        // The target subtopic
        const [targetTopic] = tSailing.subtopics;

        const { getByTestId } = render(
          <TopicNavItem trail={[tSailing.id, targetTopic]} />,
        );

        act(() => {
          // Select the two dragged root topics
          Selection.select(core, [
            Selection.item(Topics.get(draggedTopic1)),
            Selection.item(Topics.get(draggedTopic2)),
          ]);
          // Initialize a drag event
          Selection.dragStart(core, dragEvent, 'sort');
        });

        act(() => {
          // Drop onto the top drop target
          fireEvent.drop(getByTestId('top-drop-target'), dragEvent);
        });

        // Get the updated root topic IDs
        const rootTopics = App.getRootTopics().map((topic) => topic.id);
        // Get the updated target parent topic
        const targetParent = Topics.get(tSailing.id);

        // Dragged topics should be removed from the root level
        expect(rootTopics.includes(draggedTopic1)).toBeFalsy();
        // Dragged topics should be added above target topic
        expect(targetParent.subtopics).toEqual([
          draggedTopic1,
          draggedTopic2,
          ...tSailing.subtopics,
        ]);
      });
    });
  });
});
