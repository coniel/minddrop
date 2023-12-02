import { mapPropsToClasses } from '@minddrop/utils';
import './ContentListItem.css';
import { Text } from '../Text';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../Collapsible';
import { Icon } from '../Icon';
import { useTranslation } from '@minddrop/i18n';

export interface ContentListItemProps extends React.HTMLProps<HTMLDivElement> {
  /**
   * The item name.
   */
  label: string;

  /**
   * The item icon.
   */
  icon?: React.ReactNode;

  /**
   * Children rendered inside a collapsible container.
   */
  children?: React.ReactNode;

  /**
   * Internal prop not intended to be set manually.
   *
   * The nesting level of the item starting from 0 for
   * top level items, adding 1 for each subpage nexting level.
   */
  level?: number;

  /**
   * If `true`, the item expand icon will have darker styling.
   */
  hasChildren?: boolean;

  /**
   * Callback fired when the non-toggle part of the item is
   * clicked.
   */
  onClick?: (event: React.MouseEvent) => void;
}

export const ContentListItem: React.FC<ContentListItemProps> = ({
  children,
  className,
  label,
  icon,
  hasChildren,
  level = 0,
  onClick,
  ...other
}) => {
  const { t } = useTranslation();

  return (
    <Collapsible>
      <div
        className={mapPropsToClasses({ className }, 'content-list-item')}
        {...other}
      >
        <div className="list-item">
          {level > 0 && (
            <div
              role="button"
              aria-hidden="true"
              className="spacer-button"
              tabIndex={-1}
              onClick={onClick}
              style={{ paddingLeft: level * 16, height: 24 }}
            />
          )}
          <CollapsibleTrigger>
            <div
              role="button"
              tabIndex={0}
              className="toggle-button"
              aria-label={t('expand') as string}
            >
              <Icon
                name="chevron-right"
                className={mapPropsToClasses({ hasChildren }, 'toggle-icon')}
              />
            </div>
          </CollapsibleTrigger>
          <div className="item-icon">{icon}</div>
          <div
            role="button"
            tabIndex={0}
            className="label-button"
            onClick={onClick}
          >
            <Text
              as="div"
              color="light"
              weight="medium"
              className="label"
              size="regular"
            >
              {label}
            </Text>
          </div>
        </div>
        <CollapsibleContent>{children}</CollapsibleContent>
      </div>
    </Collapsible>
  );
};
