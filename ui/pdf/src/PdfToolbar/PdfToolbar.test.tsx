import { afterEach, describe, expect, it, vi } from 'vitest';
import { PdfZoom } from '@minddrop/pdf';
import { render, screen, userEvent } from '@minddrop/test-utils';
import { ToolbarIconButton } from '@minddrop/ui-primitives';
import { ZoomPresets } from '../constants';
import { cleanup } from '../test-utils';
import { PdfToolbar, PdfToolbarProps } from './PdfToolbar';

const defaultProps: PdfToolbarProps = {
  page: 2,
  pageCount: 5,
  zoom: 'fit-width',
  resolvedZoom: 1.1,
  onPageChange: () => {},
  onZoomChange: () => {},
};

function renderToolbar(props: Partial<PdfToolbarProps> = {}) {
  return render(<PdfToolbar {...defaultProps} {...props} />);
}

describe('<PdfToolbar />', () => {
  afterEach(cleanup);

  it('steps to the previous and next pages', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    renderToolbar({ onPageChange });

    await user.click(screen.getByLabelText('pdf.toolbar.previousPage'));
    await user.click(screen.getByLabelText('pdf.toolbar.nextPage'));

    expect(onPageChange).toHaveBeenNthCalledWith(1, defaultProps.page - 1);
    expect(onPageChange).toHaveBeenNthCalledWith(2, defaultProps.page + 1);
  });

  it('does not step past the document ends', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    renderToolbar({ page: 1, pageCount: 1, onPageChange });

    await user.click(screen.getByLabelText('pdf.toolbar.previousPage'));
    await user.click(screen.getByLabelText('pdf.toolbar.nextPage'));

    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('steps the zoom from the resolved zoom', async () => {
    const user = userEvent.setup();
    const zooms: PdfZoom[] = [];

    renderToolbar({
      resolvedZoom: 1.1,
      onZoomChange: (zoom) => zooms.push(zoom),
    });

    await user.click(screen.getByLabelText('pdf.toolbar.zoomIn'));
    await user.click(screen.getByLabelText('pdf.toolbar.zoomOut'));

    // A fit mode resolves to some multiple. The steps move to the
    // presets on either side of it.
    expect(zooms).toEqual([1.25, 1]);
  });

  it('does not step the zoom out past the smallest preset', async () => {
    const user = userEvent.setup();
    const zooms: PdfZoom[] = [];

    // Render the toolbar at a fit mode resolving below the smallest
    // preset.
    renderToolbar({
      zoom: 'fit-page',
      resolvedZoom: ZoomPresets[0] / 2,
      onZoomChange: (zoom) => zooms.push(zoom),
    });

    await user.click(screen.getByLabelText('pdf.toolbar.zoomOut'));

    expect(zooms).toEqual([]);
  });

  it('does not step the zoom in past the largest preset', async () => {
    const user = userEvent.setup();
    const zooms: PdfZoom[] = [];

    // Render the toolbar at a fit mode resolving above the largest
    // preset.
    renderToolbar({
      zoom: 'fit-width',
      resolvedZoom: ZoomPresets[ZoomPresets.length - 1] * 2,
      onZoomChange: (zoom) => zooms.push(zoom),
    });

    await user.click(screen.getByLabelText('pdf.toolbar.zoomIn'));

    expect(zooms).toEqual([]);
  });

  it('offers the actions it is given', () => {
    renderToolbar({
      children: (
        <ToolbarIconButton icon="maximize-2" label="pdf.element.expand" />
      ),
    });

    expect(screen.getByLabelText('pdf.element.expand')).toBeInTheDocument();
  });
});
