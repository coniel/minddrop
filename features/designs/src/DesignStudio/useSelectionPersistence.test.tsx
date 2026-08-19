import { useEffect, useState } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignFixtures } from '@minddrop/designs';
import {
  cleanup as cleanupRender,
  fireEvent,
  render,
  screen,
} from '@minddrop/test-utils';
import {
  TransientViewStateContextValue,
  TransientViewStateProvider,
} from '@minddrop/ui-primitives';
import {
  DesignStudioProvider,
  createDesignStudioStore,
  useDesignStudio,
  useDesignStudioStore,
} from '../DesignStudioStore';
import { cleanup, setup } from '../test-utils';
import { useSelectionPersistence } from './useSelectionPersistence';

const { design_books, layout_card_1, element_text_1 } = DesignFixtures;

// The key the studio records its selection under, which is
// unscoped in these tests
const StateKey = `design-studio:${design_books.id}`;

describe('useSelectionPersistence', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanupRender();
    cleanup();
  });

  it('restores the selection when the studio remounts', () => {
    const { value } = createBag();

    const session = render(<StudioSession value={value} />);

    // Select an element, as clicking it in the studio does
    fireEvent.click(screen.getByRole('button'));

    // Switch away from the tab, which unmounts the studio along
    // with its store
    session.unmount();

    render(<StudioSession value={value} />);

    expect(screen.getByRole('button').textContent).toBe(
      `${layout_card_1.id}|${element_text_1.id}`,
    );
  });

  it('records the selection under the open design', () => {
    const { bag, value } = createBag();

    render(<StudioSession value={value} />);

    fireEvent.click(screen.getByRole('button'));

    expect(bag[StateKey]).toEqual({
      layoutId: layout_card_1.id,
      elementId: element_text_1.id,
    });
  });

  it('leaves the layout without a selection when the element is gone', () => {
    // A selection recorded before the element was deleted
    const { value } = createBag({
      [StateKey]: { layoutId: layout_card_1.id, elementId: 'deleted-element' },
    });

    render(<StudioSession value={value} />);

    // The layout opens, selecting its root rather than the
    // element which no longer exists
    expect(screen.getByRole('button').textContent).toBe(
      `${layout_card_1.id}|root`,
    );
  });

  it('does not restore a layout which no longer exists', () => {
    const { value } = createBag({
      [StateKey]: { layoutId: 'deleted-layout', elementId: element_text_1.id },
    });

    render(<StudioSession value={value} />);

    expect(screen.getByRole('button').textContent).toBe('null|null');
  });
});

/**
 * Creates an in-memory state bag and a context value backed by it,
 * standing in for the tab the studio is rendered in.
 */
function createBag(initial: Record<string, unknown> = {}) {
  const bag: Record<string, unknown> = { ...initial };

  const value: TransientViewStateContextValue = {
    get: (key) => bag[key],
    set: (key, storedValue) => {
      bag[key] = storedValue;
    },
  };

  return { bag, value };
}

/**
 * Renders a studio session on a store of its own, mirroring how
 * the studio view creates and opens one per mount.
 */
const StudioSession: React.FC<{ value: TransientViewStateContextValue }> = ({
  value,
}) => {
  const [studio] = useState(createDesignStudioStore);

  // Open the design, as the studio does when it mounts
  useEffect(() => {
    studio.initialize(design_books);
  }, [studio]);

  return (
    <TransientViewStateProvider value={value}>
      <DesignStudioProvider store={studio}>
        <SelectionProbe />
      </DesignStudioProvider>
    </TransientViewStateProvider>
  );
};

/**
 * Renders the persisted selection and selects an element on click.
 */
const SelectionProbe: React.FC = () => {
  const studio = useDesignStudio();
  const activeLayoutId = useDesignStudioStore((state) => state.activeLayoutId);
  const selectedElementId = useDesignStudioStore(
    (state) => state.selectedElementId,
  );

  useSelectionPersistence();

  function handleClick() {
    studio.selectElement(element_text_1.id, layout_card_1.id);
  }

  return (
    <button type="button" onClick={handleClick}>
      {`${activeLayoutId}|${selectedElementId}`}
    </button>
  );
};
