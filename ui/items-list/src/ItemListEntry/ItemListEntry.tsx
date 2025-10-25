import { mapPropsToClasses } from '@minddrop/ui-primitives';
import './ItemListEntry.css';

export interface ItemListEntryProps extends React.HTMLProps<HTMLDivElement> {
  /**
   * The content of the ItemListEntry.
   */
  children?: React.ReactNode;
}

export const ItemListEntry: React.FC<ItemListEntryProps> = ({ children, className, ...other }) => {
  return (
    <div className={mapPropsToClasses({ className }, 'item-list-entry')} {...other}>
      {children}
    </div>
  );
};
