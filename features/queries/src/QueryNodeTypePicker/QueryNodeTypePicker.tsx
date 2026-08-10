import { useEffect, useRef } from 'react';
import { QueryNodeType } from '@minddrop/queries';
import { CanvasPoint } from '@minddrop/ui-canvas';
import { Menu, MenuItem } from '@minddrop/ui-primitives';
import './QueryNodeTypePicker.css';

export interface QueryNodeTypePickerProps {
  /**
   * The picker's position in canvas coordinates.
   */
  point: CanvasPoint;

  /**
   * Callback fired with the picked node type. Source nodes are
   * excluded because the picker creates connection targets and
   * sources take no input.
   */
  onPick(type: Exclude<QueryNodeType, 'source' | 'results'>): void;

  /**
   * Callback fired when the picker is dismissed by pressing
   * outside of it.
   */
  onClose(): void;
}

/**
 * Renders a small node type menu shown when a connection drag
 * is released on the empty canvas, creating and connecting the
 * picked node at the release point.
 */
export const QueryNodeTypePicker: React.FC<QueryNodeTypePickerProps> = ({
  point,
  onPick,
  onClose,
}) => {
  // Root element, used to detect outside presses
  const rootRef = useRef<HTMLDivElement>(null);

  // Dismiss the picker when pressing outside of it
  useEffect(() => {
    const handleWindowMouseDown = (event: MouseEvent) => {
      // Ignore presses within the picker
      if (rootRef.current?.contains(event.target as Node)) {
        return;
      }

      onClose();
    };

    window.addEventListener('mousedown', handleWindowMouseDown);

    return () => {
      window.removeEventListener('mousedown', handleWindowMouseDown);
    };
  }, [onClose]);

  return (
    <div
      ref={rootRef}
      className="queries-node-type-picker"
      style={{ left: point.x, top: point.y }}
    >
      <Menu>
        <MenuItem
          icon="list-filter"
          label="queries.nodes.filter"
          onClick={() => onPick('filter')}
        />
        <MenuItem
          icon="arrow-up-down"
          label="queries.nodes.sort"
          onClick={() => onPick('sort')}
        />
        <MenuItem
          icon="hash"
          label="queries.nodes.limit"
          onClick={() => onPick('limit')}
        />
      </Menu>
    </div>
  );
};
