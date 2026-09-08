import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignElementConfigs, Designs } from '@minddrop/designs-next';
import { testElementConfig } from '@minddrop/designs-next/test-utils';
import { Selection } from '@minddrop/selection';
import {
  createDataTransfer,
  fireEvent,
  render,
  screen,
} from '@minddrop/test-utils';
import { cleanup } from '../test-utils';
import { ElementsPalette } from './ElementsPalette';

// A content element, labelled "Natural height" by an existing key
const contentElementConfig = {
  ...testElementConfig,
  type: 'content-test',
  label: 'designsNext.naturalHeight' as const,
  group: 'content' as const,
};

// The order of the group labels in the rendered palette
function renderedGroupLabels() {
  return Array.from(document.querySelectorAll('.sidebar-group')).map(
    (group) => group.textContent,
  );
}

describe('ElementsPalette', () => {
  beforeEach(() => {
    DesignElementConfigs.register(contentElementConfig);
  });

  afterEach(() => {
    cleanup();
    Selection.clear();
    DesignElementConfigs.Store.remove(contentElementConfig.type);
  });

  it('lists the elements by group in the group order', () => {
    render(<ElementsPalette />);

    const labels = renderedGroupLabels();

    expect(labels).toHaveLength(2);
    expect(labels[0]).toContain('Content');
    expect(labels[0]).toContain('Natural height');
    expect(labels[1]).toContain('Layout');
    expect(labels[1]).toContain('Box');
  });

  it('omits empty groups', () => {
    DesignElementConfigs.Store.remove(contentElementConfig.type);

    render(<ElementsPalette />);

    expect(renderedGroupLabels()).toHaveLength(1);
  });

  it('replaces the groups with the matching elements while searching', () => {
    render(<ElementsPalette />);

    fireEvent.change(screen.getByPlaceholderText('Search elements'), {
      target: { value: 'nat' },
    });

    expect(renderedGroupLabels()).toHaveLength(0);
    expect(screen.getByText('Natural height')).toBeInTheDocument();
    expect(screen.queryByText('Box')).toBeNull();
  });

  it('shows the empty message when nothing matches', () => {
    render(<ElementsPalette />);

    fireEvent.change(screen.getByPlaceholderText('Search elements'), {
      target: { value: 'zzz' },
    });

    expect(screen.getByText('No matching elements')).toBeInTheDocument();
  });

  it('drags element types onto the design', () => {
    render(<ElementsPalette />);

    const item = screen.getByText('Box').closest('[draggable]');
    const dataTransfer = createDataTransfer({});

    fireEvent.dragStart(item!, { dataTransfer });

    expect(
      dataTransfer.getData(
        Selection.toMimeType(Designs.constants.ElementTypesDataKey),
      ),
    ).toBe(JSON.stringify([{ type: testElementConfig.type }]));
  });
});
