import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Design, Designs } from '@minddrop/designs';
import { DesignFixtures } from '@minddrop/designs/test-utils';
import {
  cleanup as cleanupRender,
  render,
  screen,
  userEvent,
  waitFor,
} from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { DesignDashboard } from './DesignDashboard';

const { design_books, design_space_virtual } = DesignFixtures;

describe('<DesignDashboard />', () => {
  beforeEach(setup);

  afterEach(() => {
    // Unmount rendered trees so queries do not match earlier tests
    cleanupRender();
    cleanup();
  });

  it('renders a card for each persisted design', () => {
    render(<DesignDashboard onOpenDesign={() => {}} />);

    // Persisted designs appear as cards
    screen.getByText(design_books.name);
  });

  it('excludes virtual designs from the grid', () => {
    // Add a virtual design to the store
    Designs.Store.set(design_space_virtual);

    render(<DesignDashboard onOpenDesign={() => {}} />);

    // The virtual design does not appear as a card
    expect(screen.queryByText(design_space_virtual.name)).toBeNull();
  });

  it('opens a design when its card is clicked', async () => {
    // Capture the design passed to the open callback
    let openedDesign: Design | null = null;

    render(
      <DesignDashboard
        onOpenDesign={(design) => {
          openedDesign = design;
        }}
      />,
    );

    // Click the design's card
    await userEvent.click(screen.getByText(design_books.name));

    // The clicked design is passed to the open callback
    expect(openedDesign!.id).toBe(design_books.id);
  });

  it('creates and opens a new design', async () => {
    // Capture the design passed to the open callback
    let openedDesign: Design | null = null;

    render(
      <DesignDashboard
        onOpenDesign={(design) => {
          openedDesign = design;
        }}
      />,
    );

    // Click the new design button
    await userEvent.click(screen.getByText('designs.new'));

    // The created design opens once persisted
    await waitFor(() => {
      expect(openedDesign).not.toBeNull();
    });

    // The created design exists in the designs store
    expect(Designs.get(openedDesign!.id)).toBeDefined();
  });
});
