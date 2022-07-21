import React from 'react';
import {
  render,
  act,
  fireEvent,
  cleanup as cleanupRender,
} from '@minddrop/test-utils';
import { Drops, DropTypeConfig } from '@minddrop/drops';
import { Topics, TOPICS_TEST_DATA } from '@minddrop/topics';
import { ExtensionConfig, Extensions } from '@minddrop/extensions';
import { cleanup, core, setup } from '../test-utils';
import { AddDropMenu } from './AddDropMenu';
import { DropdownMenu, DropdownMenuTrigger } from '@minddrop/ui';

const { tEmpty } = TOPICS_TEST_DATA;

const dropType1Config: DropTypeConfig = {
  type: 'tests:type-1',
  name: 'Type 1',
  description: 'Type 1 description',
  component: jest.fn(),
};

const dropType2Config: DropTypeConfig = {
  type: 'tests:type-2',
  name: 'Type 2',
  description: 'Type 2 description',
  component: jest.fn(),
};

const dropType1Extension: ExtensionConfig = {
  id: 'tests:drop-type-1',
  scopes: ['topic'],
  name: 'Type 1',
  description: 'Type 1 description',
  onRun: (core) => Drops.register(core, dropType1Config),
};

const dropType2Extension: ExtensionConfig = {
  id: 'tests:drop-type-2',
  scopes: ['topic'],
  name: 'Type 2',
  description: 'Type 2 description',
  onRun: (core) => Drops.register(core, dropType2Config),
};

describe('<AddDropMenu />', () => {
  beforeAll(() => {
    setup();
    // Initialize the test extensions
    Extensions.initialize(core, [dropType1Extension, dropType2Extension]);
    // Enable drop type 1 extension on a topic
    Extensions.enableOnTopics(core, dropType1Extension.id, [tEmpty.id]);
  });

  beforeEach(() => {
    setup();
  });

  afterEach(() => {
    cleanupRender();
    cleanup();
  });

  afterAll(() => {
    // Clear registered extensions
    Extensions.store.clear();
  });

  const init = () => {
    const utils = render(
      <DropdownMenu>
        <AddDropMenu menuType="dropdown" topicId={tEmpty.id} />,
        <DropdownMenuTrigger asChild>
          <button type="button">open</button>
        </DropdownMenuTrigger>
      </DropdownMenu>,
    );

    act(() => {
      // Open the menu
      fireEvent.click(utils.getByText('open'));
    });

    return utils;
  };

  it('renders the drop types enabled on the topic', () => {
    const { getByText, queryByText } = init();

    // Should render a menu item for drop type 1
    getByText(dropType1Config.name);
    // Should not render a menu item for drop type 2
    expect(queryByText(dropType2Config.name)).toBeNull();
  });

  it('creates a drop of the selected type', () => {
    const { getByText } = init();

    act(() => {
      // Create a type 1 drop
      fireEvent.click(getByText(dropType1Config.name));
    });

    // Get the updated topic
    const topic = Topics.get(tEmpty.id);

    // Topic should have a new drop
    expect(topic.drops.length).toBe(1);

    // Get the new drop
    const drop = Drops.get(topic.drops[0]);

    // Drop should be of the selected type
    expect(drop.type).toBe(dropType1Config.type);
  });
});
