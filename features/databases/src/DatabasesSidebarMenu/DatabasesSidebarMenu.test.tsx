import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseFixtures } from '@minddrop/databases';
import { Events } from '@minddrop/events';
import { render, screen, userEvent } from '@minddrop/test-utils';
import {
  OpenDatabaseViewEvent,
  OpenDatabaseViewEventData,
  OpenNewDatabaseDialogEvent,
} from '../events';
import { cleanup, setup } from '../test-utils';
import { DatabasesSidebarMenu } from './DatabasesSidebarMenu';

describe('<DatabasesSidebarMenu />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('renders the user databases', () => {
    render(<DatabasesSidebarMenu />);

    expect(screen.getByText(DatabaseFixtures.objectDatabase.name));
  });

  it('opens the database view when a database menu item is clicked', () =>
    new Promise<void>((done) => {
      Events.addListener<OpenDatabaseViewEventData>(
        OpenDatabaseViewEvent,
        'test',
        ({ data }) => {
          expect(data.name).toBe(DatabaseFixtures.objectDatabase.name);
          done();
        },
      );

      render(<DatabasesSidebarMenu />);

      userEvent.click(screen.getByText(DatabaseFixtures.objectDatabase.name));
    }));

  it('opens the new database dialog when the new database button is clicked', () =>
    new Promise<void>((done) => {
      Events.addListener(OpenNewDatabaseDialogEvent, 'test', () => {
        done();
      });

      render(<DatabasesSidebarMenu />);

      userEvent.click(screen.getByText('databases.actions.new'));
    }));
});
