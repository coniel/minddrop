import { Topics, TOPICS_TEST_DATA } from '@minddrop/topics';
import { setup, cleanup } from '../../test-utils';
import { generateTopicSelectionMenu } from './generateTopicSelectionMenu';

const { tSailing } = TOPICS_TEST_DATA;

describe('generateTopicSelectionMenu', () => {
  beforeAll(setup);

  afterAll(cleanup);

  it('generates trees of TopicSelectionMenuItemData items', () => {
    const onSelect = jest.fn();
    const result = generateTopicSelectionMenu([tSailing.id], onSelect);

    // First level topic
    expect(result[0].label).toBe(tSailing.title);
    result[0].onSelect({} as Event);
    expect(onSelect).toHaveBeenCalled();
    expect(onSelect.mock.calls[0][1]).toBe(tSailing.id);
    onSelect.mockClear();
    // Second level topic
    const nested = Topics.get(tSailing.subtopics[0]);
    expect(result[0].subtopics[0].label).toBe(nested.title);
    result[0].subtopics[0].onSelect({} as Event);
    expect(onSelect).toHaveBeenCalled();
    expect(onSelect.mock.calls[0][1]).toBe(nested.id);
    onSelect.mockClear();
    // Third level topic
    const nested2 = Topics.get(nested.subtopics[0]);
    expect(result[0].subtopics[0].subtopics[0].label).toBe(nested2.title);
    result[0].subtopics[0].subtopics[0].onSelect({} as Event);
    expect(onSelect).toHaveBeenCalled();
    expect(onSelect.mock.calls[0][1]).toBe(nested2.id);
    onSelect.mockClear();
  });
});
