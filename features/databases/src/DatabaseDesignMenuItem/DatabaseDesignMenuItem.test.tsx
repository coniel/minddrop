import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseFixtures, Databases } from '@minddrop/databases';
import { DesignFixtures } from '@minddrop/designs';
import {
  Events,
  OpenConfirmationDialogEvent,
  OpenConfirmationDialogEventData,
} from '@minddrop/events';
import {
  OpenDesignStudioEvent,
  OpenDesignStudioEventData,
} from '@minddrop/feature-design-studio';
import { render, screen, userEvent, waitFor } from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { DatabaseDesignMenuItem } from './DatabaseDesignMenuItem';

const { design_card_1 } = DesignFixtures;
const { objectDatabase } = DatabaseFixtures;

describe('<DatabaseDesignMenuItem />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('opens the design studio when clicked', () =>
    new Promise<void>((done) => {
      Events.addListener<OpenDesignStudioEventData>(
        OpenDesignStudioEvent,
        'test',
        (payload) => {
          expect(payload.data.design).toBe(design_card_1);
          done();
        },
      );

      render(
        <DatabaseDesignMenuItem
          design={design_card_1}
          databaseId={objectDatabase.id}
        />,
      );

      userEvent.click(screen.getByText(design_card_1.name));
    }));

  it('opens the design studio when edit action is clicked', () =>
    new Promise<void>((done) => {
      Events.addListener<OpenDesignStudioEventData>(
        OpenDesignStudioEvent,
        'test',
        (payload) => {
          expect(payload.data.design).toBe(design_card_1);
          done();
        },
      );

      render(
        <DatabaseDesignMenuItem
          design={design_card_1}
          databaseId={objectDatabase.id}
        />,
      );

      async function runTest() {
        await userEvent.hover(screen.getByText(design_card_1.name));
        await userEvent.click(screen.getByLabelText('actions.manage'));

        await waitFor(() => {
          expect(screen.getByText('actions.edit')).toBeVisible();
        });

        userEvent.click(screen.getByText('actions.edit'));
      }

      runTest();
    }));

  it('duplicates the design when duplicate action is clicked', () =>
    new Promise<void>((done) => {
      Events.addListener<OpenDesignStudioEventData>(
        OpenDesignStudioEvent,
        'test',
        (payload) => {
          // Should be a new ID
          expect(payload.data.design.id).not.toBe(design_card_1.id);

          // Should add the new design to the database
          expect(
            Databases.get(objectDatabase.id).designs.find(
              (d) => d.id === payload.data.design.id,
            ),
          ).toBeDefined();
          done();
        },
      );
      render(
        <DatabaseDesignMenuItem
          design={design_card_1}
          databaseId={objectDatabase.id}
        />,
      );

      async function runTest() {
        await userEvent.hover(screen.getByText(design_card_1.name));
        await userEvent.click(screen.getByLabelText('actions.manage'));

        await waitFor(() => {
          expect(screen.getByText('actions.duplicate')).toBeVisible();
        });

        userEvent.click(screen.getByText('actions.duplicate'));
      }

      runTest();
    }));

  it('deletes the design when delete action is clicked and confirmed', () =>
    new Promise<void>((done) => {
      const deignId = objectDatabase.designs[0].id;

      Events.addListener<OpenConfirmationDialogEventData>(
        OpenConfirmationDialogEvent,
        'test',
        (payload) => {
          // Confirm the delete action
          payload.data.onConfirm();

          const updatedDatabase = Databases.get(objectDatabase.id);
          expect(
            updatedDatabase.designs.find((d) => d.id === deignId),
          ).toBeUndefined();
          done();
        },
      );

      render(
        <DatabaseDesignMenuItem
          design={objectDatabase.designs[0]}
          databaseId={objectDatabase.id}
        />,
      );

      async function runTest() {
        await userEvent.hover(screen.getByText(design_card_1.name));
        await userEvent.click(screen.getByLabelText('actions.manage'));

        await waitFor(() => {
          expect(screen.getByText('actions.delete')).toBeVisible();
        });

        await userEvent.click(screen.getByText('actions.delete'));
      }

      runTest();
    }));
});
