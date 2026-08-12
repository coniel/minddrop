import { TranslationKey } from '@minddrop/i18n';
import { UiIconName } from '@minddrop/ui-icons';

export interface View {
  /**
   * A unique identifier for the view, matching the `view` field of an
   * `OpenViewEvent`. Follows the convention `[package]:view:[name]`.
   */
  type: string;

  /**
   * The component rendered for this view.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- must accept components with arbitrary props
  component: React.ComponentType<any>;

  /**
   * The i18n key of the view's label, used by views with a fixed
   * label (e.g. search). Views labelled by the entity they show
   * (e.g. a database) leave it unset and provide a title when opened.
   */
  title?: TranslationKey;

  /**
   * The view's icon, used by views with a fixed icon. Views iconed by
   * the entity they show leave it unset and provide the entity's
   * content icon when opened.
   */
  icon?: UiIconName;
}
