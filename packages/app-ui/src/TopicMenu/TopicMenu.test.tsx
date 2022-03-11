/* eslint-disable class-methods-use-this */
import React from 'react';
import { render, act, fireEvent, MockDate } from '@minddrop/test-utils';
import { i18n } from '@minddrop/i18n';
import { setup, cleanup, core } from '../test-utils';
import { DropdownMenuContent, DropdownMenu } from '@minddrop/ui';
import { Topics, TOPICS_TEST_DATA } from '@minddrop/topics';
import { TopicMenu, TopicMenuProps } from './TopicMenu';
import { App } from '@minddrop/app';

const { trail, tCoastalNavigation, tNavigation, tSailing, tUntitled } =
  TOPICS_TEST_DATA;
const topicId = trail.slice(-1)[0];

describe('TopicMenu', () => {
  beforeAll(() => {
    MockDate.set('01/01/2020');
  });

  afterAll(() => {
    MockDate.reset();
  });

  beforeEach(setup);

  afterEach(cleanup);

  function init(props: Partial<TopicMenuProps> = {}) {
    const utils = render(
      <DropdownMenu defaultOpen>
        <DropdownMenuContent>
          <TopicMenu menuType="dropdown" trail={trail} {...props} />,
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    const getByItemLabel = (i18nKey: string) => {
      const label = i18n.t(i18nKey);

      return utils.getByText(label);
    };

    const queryByItemLabel = (i18nKey: string) => {
      const label = i18n.t(i18nKey);

      return utils.queryByText(label);
    };

    return { ...utils, queryByItemLabel, getByItemLabel };
  }

  it('allows creating subtopics', (done) => {
    const onAddSubtopic = jest.fn();
    const { getByItemLabel } = init({ onAddSubtopic });

    // Listen to 'topics:add-subtopics' events
    Topics.addEventListener(core, 'topics:add-subtopics', ({ data }) => {
      if (data.topic.id === topicId) {
        // Should call onAddSubtopic callback with the added subtopic
        expect(onAddSubtopic).toHaveBeenCalledWith(
          Object.values(data.subtopics)[0],
        );
        done();
      }
    });

    // Click the 'Add subtopic' item
    act(() => {
      fireEvent.click(getByItemLabel('Add subtopic'));
    });
  });

  describe('Add to', () => {
    it('adds the topic to the selected topic', () => {
      // Create a new topic
      const topic = Topics.create(core);
      // Add new topic to the root level
      App.addRootTopics(core, [topic.id]);

      // Render with new topic as the target
      const { getByItemLabel, getByText } = init({ trail: [topic.id] });

      act(() => {
        // Click 'Add to' item
        fireEvent.click(getByItemLabel('addTo'));
      });

      act(() => {
        // Click on 'Sailing' topic
        fireEvent.click(getByText(tSailing.title));
      });

      // Get the updated 'Sailing' topic
      const parent = Topics.get(tSailing.id);

      // Should have new topic as a subtopic
      expect(parent.subtopics.includes(topic.id)).toBeTruthy();
    });

    it('adds the topic to the root level', () => {
      // Render subtopic topic as the target
      const { getByItemLabel } = init({ trail: [tSailing.id, tNavigation.id] });

      act(() => {
        // Click the 'Add to' item
        fireEvent.click(getByItemLabel('addTo'));
      });

      act(() => {
        // Click the 'Add to Topics' item
        fireEvent.click(getByItemLabel('addToTopics'));
      });

      // Get root topics
      const rootTopics = App.getRootTopics();

      // Root topics should contain added topic
      expect(
        rootTopics.find((topic) => topic.id === tNavigation.id),
      ).toBeDefined();
    });

    it("does not render 'Add to Topics' if target is a root level topic", () => {
      // Render with root level topic as target
      const { getByItemLabel, queryByItemLabel } = init({
        trail: [tSailing.id],
      });

      act(() => {
        // Click the 'Add to' item
        fireEvent.click(getByItemLabel('addTo'));
      });

      // Should not render 'Add to Topics'
      expect(queryByItemLabel('addToTopics')).toBeNull();
    });
  });

  describe('Move to', () => {
    it('moves root topic to the selected topic', () => {
      // Create a new topic
      const topic = Topics.create(core);
      // Add new topic to the root level
      App.addRootTopics(core, [topic.id]);

      // Render with new root topic as the target
      const { getByItemLabel, getByText } = init({ trail: [topic.id] });

      act(() => {
        // Click 'Move to' item
        fireEvent.click(getByItemLabel('moveTo'));
      });

      act(() => {
        // Click on 'Sailing' topic
        fireEvent.click(getByText(tSailing.title));
      });

      // Get the updated target parent topic
      const parent = Topics.get(tSailing.id);
      // Get root topics
      const rootTopics = App.getRootTopics();

      // Target parent topic should have new topic as a subtopic
      expect(parent.subtopics.includes(topic.id)).toBeTruthy();
      // Root topics should no longer contain the new topic
      expect(rootTopics.find((t) => t.id === topic.id)).not.toBeDefined();
    });

    it('moves subtopic to the selected topic', () => {
      // Render with a subtopic as the target
      const { getByItemLabel, getByText } = init({
        trail,
      });

      act(() => {
        // Click 'Move to' item
        fireEvent.click(getByItemLabel('moveTo'));
      });

      act(() => {
        // Click on 'Sailing' topic
        fireEvent.click(getByText(tSailing.title));
      });

      // Get the updated source parent topic
      const fromTopic = Topics.get(tNavigation.id);
      // Get the updated target parent topic
      const toTopic = Topics.get(tSailing.id);

      // Source parent topic should no longer contain the subtopic
      expect(fromTopic.subtopics.includes(tCoastalNavigation.id)).toBeFalsy();
      // Target parent topic should contain the subtopic
      expect(toTopic.subtopics.includes(tCoastalNavigation.id)).toBeTruthy();
    });

    it('moves subtopic to the root level', () => {
      // Render with subtopic as the target
      const { getByItemLabel } = init({ trail: [tSailing.id, tNavigation.id] });

      act(() => {
        // Click the 'Move to' item
        fireEvent.click(getByItemLabel('moveTo'));
      });

      act(() => {
        // Click the 'Move to Topics' item
        fireEvent.click(getByItemLabel('moveToTopics'));
      });

      // Get the source parent topic
      const fromTopic = Topics.get(tSailing.id);
      // Get root topics
      const rootTopics = App.getRootTopics();

      // Source parent topic should no longer contain the subtopic
      expect(fromTopic.subtopics.includes(tNavigation.id)).toBeFalsy();
      // Root topics should contain moveed topic
      expect(
        rootTopics.find((topic) => topic.id === tNavigation.id),
      ).toBeDefined();
    });

    it("does not render 'Move to Topics' if target is a root level topic", () => {
      // Render with root level topic as target
      const { getByItemLabel, queryByItemLabel } = init({
        trail: [tSailing.id],
      });

      act(() => {
        // Click the 'Move to' item
        fireEvent.click(getByItemLabel('moveTo'));
      });

      // Should not render 'Move to Topics'
      expect(queryByItemLabel('moveToTopics')).toBeNull();
    });
  });

  describe('Archive/Archive everywhere', () => {
    it('does not provide secondary action when subtopic has only a single parent', () => {
      const { getByItemLabel, queryByItemLabel } = init();

      // Should render 'Archive' item
      getByItemLabel('archive');

      // Press Shift key
      act(() => {
        fireEvent.keyDown(window, { key: 'Shift' });
      });

      // Should not have secondary 'Archive everywhere' action
      expect(queryByItemLabel('archiveEverywhere')).toBeNull();
    });

    it('provides secondary action when subtopic has multiple parents', () => {
      // Add a second parent to the subtopic
      Topics.addSubtopics(core, tUntitled.id, [topicId]);

      // Render
      const { getByItemLabel, queryByItemLabel } = init();

      // Should render 'Archive' item by default
      getByItemLabel('archive');
      // Should not render 'Archive everywhere' item by default
      expect(queryByItemLabel('archiveEverywhere')).toBeNull();

      // Press Shift key
      act(() => {
        fireEvent.keyDown(window, { key: 'Shift' });
      });

      // Should render 'Archive everywhere' item
      getByItemLabel('archiveEverywhere');
      // Should not render 'Archive' item
      expect(queryByItemLabel('archive')).toBeNull();
    });

    it('provides secondary action when topic is at root level and a subtopic', () => {
      // Add the topic to the root level
      App.addRootTopics(core, [topicId]);

      // Render
      const { getByItemLabel, queryByItemLabel } = init();

      // Should render 'Archive' item by default
      getByItemLabel('archive');
      // Should not render 'Archive everywhere' item by default
      expect(queryByItemLabel('archiveEverywhere')).toBeNull();

      // Press Shift key
      act(() => {
        fireEvent.keyDown(window, { key: 'Shift' });
      });

      // Should render 'Archive everywhere' item
      getByItemLabel('archiveEverywhere');
      // Should not render 'Archive' item
      expect(queryByItemLabel('archive')).toBeNull();
    });

    it('archives a subtopic in its parent topic', () => {
      const onArchive = jest.fn();

      // Render with an onArchive callback
      const { getByItemLabel } = init({ onArchive });

      // Click on the 'Archive' item
      act(() => {
        fireEvent.click(getByItemLabel('archive'));
      });

      // Get the updated parent topic
      const parent = Topics.get(tNavigation.id);

      // Should be archived in the parent topic
      expect(parent.archivedSubtopics.includes(topicId)).toBeTruthy();
      // Should call onArchive callback
      expect(onArchive).toHaveBeenCalled();
    });

    it('archives a root level topic', () => {
      const onArchive = jest.fn();

      // Render with a root level topic, and an onArchive callback
      const { getByItemLabel } = init({ trail: [tSailing.id], onArchive });

      // Click on the 'Archive' item
      act(() => {
        fireEvent.click(getByItemLabel('archive'));
      });

      // Get the archived root topic IDs
      const archivedRootTopicIds = App.getArchivedRootTopics().map((t) => t.id);

      // Should be archived at the root level
      expect(archivedRootTopicIds.includes(tSailing.id)).toBeTruthy();
      // Should call onArchive callback
      expect(onArchive).toHaveBeenCalled();
    });

    it('archives in all subtopics when using the secondary action', () => {
      const onArchive = jest.fn();

      // Add a second parent to the subtopic
      Topics.addSubtopics(core, tUntitled.id, [topicId]);

      // Render with an onArchive callback
      const { getByItemLabel } = init({ onArchive });

      act(() => {
        // Press the Shift key
        fireEvent.keyDown(window, { key: 'Shift' });
      });

      act(() => {
        // Click the 'Archive eveywhere' item
        fireEvent.click(getByItemLabel('archiveEverywhere'));
      });

      // Get the updated parent topics
      const parent1 = Topics.get(tNavigation.id);
      const parent2 = Topics.get(tUntitled.id);

      // Should be archived in both parents
      expect(parent1.archivedSubtopics.includes(topicId)).toBeTruthy();
      expect(parent2.archivedSubtopics.includes(topicId)).toBeTruthy();
      // Should call onArchive callback
      expect(onArchive).toHaveBeenCalled();
    });

    it('archives at root level and in subtopics when using the secondary action', () => {
      const onArchive = jest.fn();

      // Add the topic to the root level
      App.addRootTopics(core, [topicId]);

      // Render with an onArchive callback
      const { getByItemLabel } = init({ onArchive });

      act(() => {
        // Press the Shift key
        fireEvent.keyDown(window, { key: 'Shift' });
      });

      act(() => {
        // Click the 'Archive eveywhere' item
        fireEvent.click(getByItemLabel('archiveEverywhere'));
      });

      // Get the archived root topic IDs
      const archivedRootTopicIds = App.getArchivedRootTopics().map((t) => t.id);
      // Get the updated parent topics
      const parent = Topics.get(tNavigation.id);

      // Should be archived at the root level
      expect(archivedRootTopicIds.includes(tCoastalNavigation.id)).toBeTruthy();
      // Should be archived in both parents
      expect(parent.archivedSubtopics.includes(topicId)).toBeTruthy();
      // Should call onArchive callback
      expect(onArchive).toHaveBeenCalled();
    });
  });

  describe('Delete/Delete everywhere', () => {
    it('does not provide secondary action when subtopic has only a single parent', () => {
      const { getByItemLabel, queryByItemLabel } = init();

      // Should render 'Delete' item
      getByItemLabel('delete');

      // Press Shift key
      act(() => {
        fireEvent.keyDown(window, { key: 'Shift' });
      });

      // Should not have secondary 'Delete everywhere' action
      expect(queryByItemLabel('deleteEverywhere')).toBeNull();
    });

    it('provides secondary action when subtopic has multiple parents', () => {
      // Add a second parent to the subtopic
      Topics.addSubtopics(core, tUntitled.id, [topicId]);

      // Render
      const { getByItemLabel, queryByItemLabel } = init();

      // Should render 'Delete' item by default
      getByItemLabel('delete');
      // Should not render 'Delete everywhere' item by default
      expect(queryByItemLabel('deleteEverywhere')).toBeNull();

      // Press Shift key
      act(() => {
        fireEvent.keyDown(window, { key: 'Shift' });
      });

      // Should render 'Delete everywhere' item
      getByItemLabel('deleteEverywhere');
      // Should not render 'Delete' item
      expect(queryByItemLabel('delete')).toBeNull();
    });

    it('provides secondary action when topic is at root level and a subtopic', () => {
      // Add the topic to the root level
      App.addRootTopics(core, [topicId]);

      // Render
      const { getByItemLabel, queryByItemLabel } = init();

      // Should render 'Delete' item by default
      getByItemLabel('delete');
      // Should not render 'Delete everywhere' item by default
      expect(queryByItemLabel('deleteEverywhere')).toBeNull();

      // Press Shift key
      act(() => {
        fireEvent.keyDown(window, { key: 'Shift' });
      });

      // Should render 'Delete everywhere' item
      getByItemLabel('deleteEverywhere');
      // Should not render 'Delete' item
      expect(queryByItemLabel('delete')).toBeNull();
    });

    it('deletes a subtopic when it has only a single parent', () => {
      const onDelete = jest.fn();

      // Render with an onDelete callback
      const { getByItemLabel } = init({ onDelete });

      // Click on the 'Delete' item
      act(() => {
        fireEvent.click(getByItemLabel('delete'));
      });

      // Get the updated subtopic
      const subtopic = Topics.get(topicId);

      // Should be deleted
      expect(subtopic.deleted).toBe(true);
      // Should call onDelete callback
      expect(onDelete).toHaveBeenCalled();
    });

    it('deletes a root level topic which has no other parents', () => {
      const onDelete = jest.fn();

      // Render with a root level topic, and an onDelete callback
      const { getByItemLabel } = init({ trail: [tSailing.id], onDelete });

      // Click on the 'Delete' item
      act(() => {
        fireEvent.click(getByItemLabel('delete'));
      });

      // Get the updated topic
      const topic = Topics.get(tSailing.id);

      // Should be deleted
      expect(topic.deleted).toBe(true);
      // Should call onDelete callback
      expect(onDelete).toHaveBeenCalled();
    });

    it('removes from parent topic but does not delete a subtopic with multiple parent topics', () => {
      const onDelete = jest.fn();

      // Add a second parent to the subtopic
      Topics.addSubtopics(core, tUntitled.id, [topicId]);

      // Render with an onDelete callback
      const { getByItemLabel } = init({ onDelete });

      act(() => {
        // Click the 'Delete' item
        fireEvent.click(getByItemLabel('delete'));
      });

      // Get the updated parent topic
      const parentTopic = Topics.get(tNavigation.id);
      // Get the second parent
      const otherParentTopic = Topics.get(tUntitled.id);
      // Get the updated subtopic
      const subtopic = Topics.get(topicId);

      // Should be removed from the parent topic
      expect(parentTopic.subtopics.includes(topicId)).toBeFalsy();
      // Should not be removed from the other parent
      expect(otherParentTopic.subtopics.includes(topicId)).toBe(true);
      // Should not be deleted
      expect(subtopic.deleted).toBeFalsy();
      // Should call onDelete callback
      expect(onDelete).toHaveBeenCalled();
    });

    it('removes from parent topic but does not delete a subtopic with a single parent also appearing a the root level', () => {
      const onDelete = jest.fn();

      // Add the topic to the root level
      App.addRootTopics(core, [topicId]);

      // Render with an onDelete callback
      const { getByItemLabel } = init({ onDelete });

      act(() => {
        // Click the 'Delete' item
        fireEvent.click(getByItemLabel('delete'));
      });

      // Get the updated parent topic
      const parentTopic = Topics.get(tNavigation.id);
      // Get root topic IDs
      const rootTopicIds = App.getRootTopics().map((t) => t.id);
      // Get the updated subtopic
      const subtopic = Topics.get(topicId);

      // Should be removed from the parent topic
      expect(parentTopic.subtopics.includes(topicId)).toBeFalsy();
      // Should not be removed from the root level
      expect(rootTopicIds.includes(topicId)).toBe(true);
      // Should not be deleted
      expect(subtopic.deleted).toBeFalsy();
      // Should call onDelete callback
      expect(onDelete).toHaveBeenCalled();
    });

    it('removes from parent topic but does not delete a subtopic with a single parent also appearing a the root level', () => {
      const onDelete = jest.fn();

      // Add the topic to the root level
      App.addRootTopics(core, [topicId]);

      // Render with a root level topic and an onDelete callback
      const { getByItemLabel } = init({ trail: [topicId], onDelete });

      act(() => {
        // Click the 'Delete' item
        fireEvent.click(getByItemLabel('delete'));
      });

      // Get root topic IDs
      const rootTopicIds = App.getRootTopics().map((t) => t.id);
      // Get the updated parent topic
      const parentTopic = Topics.get(tNavigation.id);
      // Get the updated subtopic
      const subtopic = Topics.get(topicId);

      // Should be removed from the root level
      expect(rootTopicIds.includes(topicId)).toBe(false);
      // Should not be removed from the parent topic
      expect(parentTopic.subtopics.includes(topicId)).toBe(true);
      // Should not be deleted
      expect(subtopic.deleted).toBeFalsy();
      // Should call onDelete callback
      expect(onDelete).toHaveBeenCalled();
    });

    it('deletes a subtopic which has multiple parents when using the secondary action', () => {
      const onDelete = jest.fn();

      // Add a second parent to the subtopic
      Topics.addSubtopics(core, tUntitled.id, [topicId]);

      // Render with an onDelete callback
      const { getByItemLabel } = init({ onDelete });

      act(() => {
        // Press the Shift key
        fireEvent.keyDown(window, { key: 'Shift' });
      });

      act(() => {
        // Click the 'Delete eveywhere' item
        fireEvent.click(getByItemLabel('deleteEverywhere'));
      });

      // Get the updated subtopic
      const subtopic = Topics.get(topicId);

      // Should be deleted
      expect(subtopic.deleted).toBe(true);
      // Should call onDelete callback
      expect(onDelete).toHaveBeenCalled();
    });

    it('deletes a root level topic which is also a subtopic when using the secondary action', () => {
      const onDelete = jest.fn();

      // Add the topic to the root level
      App.addRootTopics(core, [topicId]);

      // Render with an onDelete callback
      const { getByItemLabel } = init({ onDelete });

      act(() => {
        // Press the Shift key
        fireEvent.keyDown(window, { key: 'Shift' });
      });

      act(() => {
        // Click the 'Delete eveywhere' item
        fireEvent.click(getByItemLabel('deleteEverywhere'));
      });

      // Get the updated subtopic
      const subtopic = Topics.get(topicId);

      // Should be deleted
      expect(subtopic.deleted).toBe(true);
      // Should call onDelete callback
      expect(onDelete).toHaveBeenCalled();
    });
  });

  describe('Rename', () => {
    it('calls onRename when clicked', () => {
      const onRename = jest.fn();

      // Render with onRename callback
      const { getByItemLabel } = init({ onRename });

      act(() => {
        // Click on the 'Rename' option
        fireEvent.click(getByItemLabel('rename'));
      });

      // Should call onRename callback
      expect(onRename).toHaveBeenCalled();
    });

    it('is not rendered if callback is not passed in', () => {
      const { queryByItemLabel } = init();

      // Should not contain 'Rename' item
      expect(queryByItemLabel('rename')).toBeNull();
    });
  });
});
