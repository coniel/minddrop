import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { Events } from '@minddrop/events';
import { render, screen, userEvent } from '@minddrop/test-utils';
import { SubviewDescriptor, Views } from '@minddrop/views';
import { DatabaseViewName } from '../events';
import { cleanup, setup } from '../test-utils';
import { DatabaseView } from './DatabaseView';

const { objectDatabase } = DatabaseFixtures;

// The designs subview shown in design mode
const designsSubview: SubviewDescriptor = { id: 'designs' };

/**
 * Renders the database view inside a subview context, trailed by
 * its own breadcrumb while it shows a subview.
 *
 * @param subview - The subview the view currently shows.
 * @returns The render container.
 */
function renderView(subview: SubviewDescriptor | null = null) {
  const breadcrumbs = subview
    ? [{ view: DatabaseViewName, title: objectDatabase.name }]
    : [];

  const { container } = render(
    <Views.BreadcrumbsProvider breadcrumbs={breadcrumbs}>
      <Views.SubviewProvider subview={subview}>
        <DatabaseView databaseId={objectDatabase.id} />
      </Views.SubviewProvider>
    </Views.BreadcrumbsProvider>,
  );

  return container;
}

describe('<DatabaseView />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("renders the database's title", () => {
    renderView();

    screen.getByText(objectDatabase.name);
  });

  it('renders a not found message when the database does not exist', () => {
    const { getByText } = render(<DatabaseView databaseId="missing" />);

    getByText('Database not found.');
  });

  it('renders the database views', () => {
    const container = renderView();

    expect(container.querySelector('.database-view')).not.toBeNull();
  });

  it('enters design mode by showing the designs subview', async () =>
    new Promise<void>((done) => {
      const user = userEvent.setup();

      Events.addListener(Views.events.SetSubview, 'test', (data) => {
        expect(data.subview?.id).toBe('designs');
        done();
      });

      renderView();

      user.click(screen.getByLabelText('databases.design.actions.designMode'));
    }));

  it('renders design mode while showing the designs subview', () => {
    const container = renderView(designsSubview);

    expect(container.querySelector('.database-design-mode')).not.toBeNull();
    screen.getByText('databases.design.title');
  });

  it('hides the design mode and new entry actions in design mode', () => {
    renderView(designsSubview);

    expect(
      screen.queryByLabelText('databases.design.actions.designMode'),
    ).toBeNull();
    expect(screen.queryByLabelText('databases.actions.newEntry')).toBeNull();
    screen.getByLabelText('databases.actions.configuration');
  });

  it("leaves design mode from the database's breadcrumb", async () =>
    new Promise<void>((done) => {
      const user = userEvent.setup();

      Events.addListener(Views.events.SetSubview, 'test', (data) => {
        expect(data.subview).toBeNull();
        done();
      });

      renderView(designsSubview);

      user.click(screen.getByText(objectDatabase.name));
    }));
});
