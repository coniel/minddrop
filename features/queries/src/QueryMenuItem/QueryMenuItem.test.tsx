import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { QueryFixtures } from '@minddrop/queries/test-utils';
import { render, screen, userEvent } from '@minddrop/test-utils';
import { OpenQueriesViewEvent } from '../events';
import { cleanup, setup } from '../test-utils';
import { QueryMenuItem } from './QueryMenuItem';

const { query_1 } = QueryFixtures;

describe('<QueryMenuItem />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('renders the query by name', () => {
    render(<QueryMenuItem queryId={query_1.id} />);

    expect(screen.getByText(query_1.name)).toBeInTheDocument();
  });

  it('renders nothing for a query which does not exist', () => {
    const { container } = render(<QueryMenuItem queryId="query_missing" />);

    expect(container).toBeEmptyDOMElement();
  });

  it('opens the queries view showing the query when clicked', () =>
    new Promise<void>((done) => {
      Events.addListener(OpenQueriesViewEvent, 'test', (data) => {
        expect(data?.queryId).toBe(query_1.id);
        Events.removeListener(OpenQueriesViewEvent, 'test');
        done();
      });

      render(<QueryMenuItem queryId={query_1.id} />);

      userEvent.click(screen.getByText(query_1.name));
    }));
});
