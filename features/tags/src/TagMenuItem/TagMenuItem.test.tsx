import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { Tags } from '@minddrop/tags';
import { TagFixtures } from '@minddrop/tags/test-utils';
import { render, screen, userEvent } from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { TagMenuItem } from './TagMenuItem';

const { tag_1 } = TagFixtures;

describe('<TagMenuItem />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('renders the tag by name', () => {
    render(<TagMenuItem tagId={tag_1.id} />);

    expect(screen.getByText(tag_1.name)).toBeInTheDocument();
  });

  it('renders nothing for a tag which does not exist', () => {
    const { container } = render(<TagMenuItem tagId="tag_missing" />);

    expect(container).toBeEmptyDOMElement();
  });

  it('opens the tags view showing the tag when clicked', () =>
    new Promise<void>((done) => {
      Events.addListener(Tags.events.OpenView, 'test', (data) => {
        expect(data?.tagId).toBe(tag_1.id);
        Events.removeListener(Tags.events.OpenView, 'test');
        done();
      });

      render(<TagMenuItem tagId={tag_1.id} />);

      userEvent.click(screen.getByText(tag_1.name));
    }));
});
