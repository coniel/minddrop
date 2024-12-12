import { forwardRef } from 'react';
import { mapPropsToClasses } from '@minddrop/utils';
import { ContentIconName } from '@minddrop/icons';
import { ContentIcon, Tooltip } from '@minddrop/ui-elements';
import './DocumentContentToolbarItem.css';

export interface DocumentContentToolbarItemProps
  extends React.HTMLProps<HTMLDivElement> {
  /**
   * The icon used to represent the item.
   */
  icon: ContentIconName;

  /**
   * Whether the item is toggled on. Affects the icon color.
   */
  toggled?: boolean;

  /**
   * The description of the item displayed in the tooltip.
   */
  tooltip: string;

  /**
   * Whether the tooltip is open. Used to control the tooltip
   * visibility.
   */
  tooltipOpen?: boolean;
}

export const DocumentContentToolbarItem = forwardRef<
  HTMLDivElement,
  DocumentContentToolbarItemProps
>(({ className, icon, tooltip, tooltipOpen, toggled, ...other }, ref) => {
  return (
    <Tooltip
      open={tooltipOpen}
      title={tooltip}
      className="document-content-toolbar-item-tooltip"
      side="top"
      sideOffset={12}
    >
      <div
        ref={ref}
        className={mapPropsToClasses(
          { className, toggled },
          'document-content-toolbar-item',
        )}
        {...other}
      >
        <ContentIcon name={icon} />
      </div>
    </Tooltip>
  );
});

DocumentContentToolbarItem.displayName = 'DocumentContentToolbarItem';
