import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, userEvent } from '@minddrop/test-utils';
import { PdfFixtures, cleanup } from '../test-utils';
import { PdfAnnotationToolbar } from './PdfAnnotationToolbar';

const { pdfTextSelection_1 } = PdfFixtures;
const { anchor } = pdfTextSelection_1;

describe('<PdfAnnotationToolbar />', () => {
  afterEach(cleanup);

  it('picks a colour', async () => {
    const user = userEvent.setup();
    const onColorPick = vi.fn();

    render(<PdfAnnotationToolbar anchor={anchor} onColorPick={onColorPick} />);

    await user.click(screen.getByLabelText('color.green'));

    expect(onColorPick).toHaveBeenCalledWith('green');
  });

  it('deletes the annotation', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(
      <PdfAnnotationToolbar
        anchor={anchor}
        color="yellow"
        onColorPick={() => {}}
        onDelete={onDelete}
      />,
    );

    await user.click(screen.getByLabelText('pdf.annotations.delete'));

    expect(onDelete).toHaveBeenCalled();
  });

  it('offers no delete action for a selection', () => {
    render(<PdfAnnotationToolbar anchor={anchor} onColorPick={() => {}} />);

    expect(screen.queryByLabelText('pdf.annotations.delete')).toBeNull();
  });
});
