import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DataView, DataViews } from '@minddrop/data-views';
import { DataViewFixtures } from '@minddrop/data-views/test-utils';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { render, screen, userEvent } from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { DataViewTabBar } from './DataViewTabBar';

const { dataView_gallery_1, dataView_gallery_2, dataViewType_table } =
  DataViewFixtures;
const { urlDatabase } = DatabaseFixtures;

// Two table views of the URL database
const linksView: DataView = {
  ...dataView_gallery_1,
  type: dataViewType_table.type,
  name: 'Links',
  dataSource: { type: 'database', id: urlDatabase.id },
};
const archiveView: DataView = {
  ...dataView_gallery_2,
  type: dataViewType_table.type,
  name: 'Archive',
  dataSource: { type: 'database', id: urlDatabase.id },
};
const views = [linksView, archiveView];

// The arguments of the most recent callback calls
let changedViewId: string | null;
let addedType: string | null;

// Renders the bar with recording callbacks
function renderBar(activeViewId: string | null = linksView.id) {
  return render(
    <DataViewTabBar
      views={views}
      activeViewId={activeViewId}
      dataSources={['database']}
      onActiveViewChange={(viewId) => {
        changedViewId = viewId;
      }}
      onSort={() => undefined}
      onAddView={(type) => {
        addedType = type;
      }}
    />,
  );
}

describe('<DataViewTabBar />', () => {
  beforeEach(() => {
    setup();
    DataViews.Store.load(views);

    changedViewId = null;
    addedType = null;
  });

  afterEach(cleanup);

  it('renders a tab per view', () => {
    renderBar();

    screen.getByText(linksView.name);
    screen.getByText(archiveView.name);
  });

  it('reports the selected tab', async () => {
    renderBar();

    await userEvent.click(screen.getByText(archiveView.name));

    expect(changedViewId).toBe(archiveView.id);
  });

  it('opens the settings menu when the active tab is clicked', async () => {
    renderBar();

    await userEvent.click(screen.getByText(linksView.name));

    expect(screen.getByDisplayValue(linksView.name)).toBeInTheDocument();
  });

  it('reports the view type picked from the add menu', async () => {
    renderBar();

    await userEvent.click(screen.getByLabelText('Add view'));
    await userEvent.click(screen.getByText(dataViewType_table.name));

    expect(addedType).toBe(dataViewType_table.type);
  });

  it('renders only the add menu without an active view', () => {
    const { container } = renderBar(null);

    expect(container.querySelector('[role="tablist"]')).toBeNull();
    screen.getByLabelText('Add view');
  });
});
