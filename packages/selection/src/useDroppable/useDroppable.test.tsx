import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@minddrop/test-utils';
import { toMimeType } from '../utils';
import { useDroppable } from './useDroppable';

// Stands in for the data transfer object the browser hands a drag,
// which the test environment does not provide.
const dataTransfer = {
  types: [],
  getData: () => '',
} as unknown as DataTransfer;

/**
 * A drop target reporting whether it is dragged over, holding
 * whatever nested targets it is given.
 */
const Droppable: React.FC<{
  id: string;
  accepts?: string[];
  claim?: boolean;
  children?: React.ReactNode;
}> = ({ id, accepts, claim, children }) => {
  const { droppableProps, isDraggingOver } = useDroppable({
    type: 'test',
    id,
    accepts,
    claim,
  });

  return (
    <div
      data-testid={id}
      data-dragging-over={isDraggingOver}
      {...droppableProps}
    >
      {children}
    </div>
  );
};

// A drag carrying data of the given types
function dragOf(...types: string[]): DataTransfer {
  return {
    types: types.map((type) => toMimeType(type)),
    getData: () => 'true',
  } as unknown as DataTransfer;
}

describe('useDroppable', () => {
  afterEach(cleanup);

  it('reports being dragged over', () => {
    render(<Droppable id="target" />);

    fireEvent.dragOver(screen.getByTestId('target'), { dataTransfer });

    expect(screen.getByTestId('target')).toHaveAttribute(
      'data-dragging-over',
      'true',
    );
  });

  it('stops reporting it when the drag leaves', () => {
    render(<Droppable id="target" />);

    fireEvent.dragOver(screen.getByTestId('target'), { dataTransfer });
    fireEvent.dragLeave(screen.getByTestId('target'), { dataTransfer });

    expect(screen.getByTestId('target')).toHaveAttribute(
      'data-dragging-over',
      'false',
    );
  });

  describe('accepted types', () => {
    it('ignores a drag carrying none of them', () => {
      render(<Droppable id="target" accepts={['wanted']} />);

      fireEvent.dragOver(screen.getByTestId('target'), {
        dataTransfer: dragOf('other'),
      });

      expect(screen.getByTestId('target')).toHaveAttribute(
        'data-dragging-over',
        'false',
      );
    });

    it('keeps an accepted drag from the targets around it', () => {
      render(
        <Droppable id="outer">
          <Droppable id="inner" accepts={['wanted']} />
        </Droppable>,
      );

      fireEvent.dragOver(screen.getByTestId('inner'), {
        dataTransfer: dragOf('wanted'),
      });

      expect(screen.getByTestId('outer')).toHaveAttribute(
        'data-dragging-over',
        'false',
      );
    });

    it('lets an accepted drag reach the targets around it when not claiming it', () => {
      render(
        <Droppable id="outer">
          <Droppable id="inner" accepts={['wanted']} claim={false} />
        </Droppable>,
      );

      fireEvent.dragOver(screen.getByTestId('inner'), {
        dataTransfer: dragOf('wanted'),
      });

      expect(screen.getByTestId('outer')).toHaveAttribute(
        'data-dragging-over',
        'true',
      );
    });
  });

  it('stops reporting it when a nested drop target takes the drop', () => {
    render(
      <Droppable id="outer">
        <Droppable id="inner" />
      </Droppable>,
    );

    // The drag over the nested target reaches the outer one as well
    fireEvent.dragOver(screen.getByTestId('inner'), { dataTransfer });

    expect(screen.getByTestId('outer')).toHaveAttribute(
      'data-dragging-over',
      'true',
    );

    fireEvent.drop(screen.getByTestId('inner'), { dataTransfer });

    expect(screen.getByTestId('outer')).toHaveAttribute(
      'data-dragging-over',
      'false',
    );
  });
});
