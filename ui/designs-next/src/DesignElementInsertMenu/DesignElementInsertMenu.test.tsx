import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignElementConfigs } from '@minddrop/designs-next';
import { testElementConfig } from '@minddrop/designs-next/test-utils';
import { render, screen, userEvent } from '@minddrop/test-utils';
import { cleanup } from '../test-utils';
import { DesignElementInsertMenu } from './DesignElementInsertMenu';

// A content element, labelled "Natural height" by an existing key
const contentElementConfig = {
  ...testElementConfig,
  type: 'content-test',
  label: 'designsNext.naturalHeight' as const,
  group: 'content' as const,
};

// The type passed to the most recent onSelect call
let selectedType: string | null;

/**
 * Renders the menu open, recording the selected element type.
 */
function renderMenu() {
  render(
    <DesignElementInsertMenu
      anchor={() => document.body}
      open
      onOpenChange={() => {}}
      onSelect={(type) => {
        selectedType = type;
      }}
    />,
  );
}

// The order of the group labels in the rendered menu
function renderedGroupLabels() {
  return Array.from(document.querySelectorAll('.menu-label')).map(
    (label) => label.textContent,
  );
}

// The text of the search results replacing the groups. The groups
// stay in the DOM behind them, hidden by the searchable menu.
function searchResultsText() {
  return document.querySelector('.searchable-menu-results')?.textContent;
}

describe('DesignElementInsertMenu', () => {
  beforeEach(() => {
    selectedType = null;
    DesignElementConfigs.register(contentElementConfig);
  });

  afterEach(() => {
    cleanup();
    DesignElementConfigs.Store.remove(contentElementConfig.type);
  });

  it('lists the elements by group in the group order', () => {
    renderMenu();

    expect(renderedGroupLabels()).toEqual(['Content', 'Layout']);
    screen.getByText('Natural height');
    screen.getByText('Box');
  });

  it('omits empty groups', () => {
    DesignElementConfigs.Store.remove(contentElementConfig.type);

    renderMenu();

    expect(renderedGroupLabels()).toEqual(['Layout']);
  });

  it('replaces the groups with the matching elements while searching', async () => {
    renderMenu();

    await userEvent.type(screen.getByPlaceholderText('Insert element'), 'nat');

    expect(searchResultsText()).toContain('Natural height');
    expect(searchResultsText()).not.toContain('Box');
  });

  it('shows the empty message when nothing matches', async () => {
    renderMenu();

    await userEvent.type(screen.getByPlaceholderText('Insert element'), 'zzz');

    screen.getByText('No matching elements');
  });

  it('reports the selected element type', async () => {
    renderMenu();

    await userEvent.click(screen.getByText('Box'));

    expect(selectedType).toBe(testElementConfig.type);
  });
});
