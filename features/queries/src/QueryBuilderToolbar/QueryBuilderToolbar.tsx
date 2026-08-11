import { TranslationKey } from '@minddrop/i18n';
import { QueryNodeType } from '@minddrop/queries';
import {
  Icon,
  IconProps,
  Tooltip,
  ViewFloatingToolbar,
} from '@minddrop/ui-primitives';
import { useQueryToolbarCardDraggable } from '../useQueryToolbarCardDraggable';
import './QueryBuilderToolbar.css';

/**
 * Renders the query builder's floating toolbar, containing a
 * draggable card for each node type. Dragging a card onto the
 * canvas creates the node at the drop position.
 *
 * Floats at the bottom center of the canvas and is revealed
 * while the builder is hovered.
 */
export const QueryBuilderToolbar: React.FC = () => (
  <ViewFloatingToolbar position="absolute">
    <ToolbarCard
      type="source"
      icon="database"
      tooltip="queries.toolbar.source"
    />
    <ToolbarCard
      type="filter"
      icon="list-filter"
      tooltip="queries.toolbar.filter"
    />
    <ToolbarCard
      type="sort"
      icon="arrow-up-down"
      tooltip="queries.toolbar.sort"
    />
    <ToolbarCard type="limit" icon="hash" tooltip="queries.toolbar.limit" />
  </ViewFloatingToolbar>
);

interface ToolbarCardProps {
  /**
   * The type of node the card creates.
   */
  type: Exclude<QueryNodeType, 'results'>;

  /**
   * The icon representing the node type.
   */
  icon: IconProps['name'];

  /**
   * The translation key of the card's tooltip.
   */
  tooltip: TranslationKey;
}

/**
 * Renders a draggable toolbar card representing a node type.
 */
const ToolbarCard: React.FC<ToolbarCardProps> = ({ type, icon, tooltip }) => {
  const { isDragging, draggableProps } = useQueryToolbarCardDraggable(type);

  return (
    <Tooltip title={tooltip} side="top">
      <div
        className="query-builder-toolbar-card"
        data-dragging={isDragging || undefined}
        {...draggableProps}
      >
        <Icon name={icon} color="regular" />
      </div>
    </Tooltip>
  );
};
