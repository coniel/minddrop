import { UiIconName } from '@minddrop/ui-icons';

export interface SubviewDescriptor {
  /**
   * The id of the entity the view currently shows within itself
   * (e.g. the selected data view in the data views list).
   */
  id: string;

  /**
   * Display title of the subview, shown in the view's tab and
   * breadcrumb trail.
   */
  title?: string;

  /**
   * Label of the view's tab while it shows the subview, when it
   * differs from the title (e.g. the item selected within the
   * subview). The breadcrumb trail keeps the title.
   *
   * @default title
   */
  label?: string;

  /**
   * UI icon of the subview, shown in the view's tab and breadcrumb
   * trail.
   */
  icon?: UiIconName;

  /**
   * Content icon of the subview as a serializable icon string, shown
   * in the view's tab and breadcrumb trail. Takes priority over
   * `icon`.
   */
  contentIcon?: string;
}
