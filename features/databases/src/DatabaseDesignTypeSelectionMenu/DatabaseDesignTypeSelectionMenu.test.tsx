import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseFixtures, Databases } from '@minddrop/databases';
import { Events } from '@minddrop/events';
import {
  OpenDesignStudioEvent,
  OpenDesignStudioEventData,
} from '@minddrop/feature-design-studio';
import { render, screen, userEvent, waitFor } from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { DatabaseDesignTypeSelectionMenu } from './DatabaseDesignTypeSelectionMenu';

const { objectDatabase } = DatabaseFixtures;

describe('<DatabaseDesignTypeSelectionMenu />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it.each(['card', 'page', 'list'])(
    'creates a new %s design and opens the design studio',
    (type) =>
      new Promise<void>((done) => {
        const listenerKey = `test-${type}`;

        Events.addListener<OpenDesignStudioEventData>(
          OpenDesignStudioEvent,
          listenerKey,
          (payload) => {
            Events.removeListener(OpenDesignStudioEvent, listenerKey);
            expect(payload.data.design).toBeDefined();

            const database = Databases.get(objectDatabase.id);
            const design = database.designs.find(
              (d) => d.id === payload.data.design.id,
            );

            expect(design).toBeDefined();
            expect(design?.type).toBe(type);

            done();
          },
        );

        async function runTest() {
          render(
            <DatabaseDesignTypeSelectionMenu databaseId={objectDatabase.id} />,
          );

          await userEvent.click(
            screen.getByLabelText('databases.actions.addDesign'),
          );

          await waitFor(() => {
            expect(screen.getByText(`designs.${type}.new`)).toBeVisible();
          });

          await userEvent.click(screen.getByText(`designs.${type}.new`));
        }

        runTest();
      }),
  );
});
