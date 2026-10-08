import { DesignElementConfigs } from '@minddrop/designs-next';
import { I18n } from '@minddrop/i18n';
import {
  BoxElementConfig,
  ChipsElementConfig,
  DateElementConfig,
  EditorElementConfig,
  EditorTitleElementConfig,
  HeadingElementConfig,
  IconElementConfig,
  LabelElementConfig,
  LinkElementConfig,
  NumberElementConfig,
  TextElementConfig,
} from '../elements';
import { locales } from '../locales';

/**
 * Initializes the designs feature.
 */
export function initializeDesignsNextFeature(): void {
  // Register the feature's translations
  I18n.registerTranslations(locales);

  // Register the built-in element configs
  DesignElementConfigs.register(BoxElementConfig);
  DesignElementConfigs.register(ChipsElementConfig);
  DesignElementConfigs.register(DateElementConfig);
  DesignElementConfigs.register(EditorElementConfig);
  DesignElementConfigs.register(EditorTitleElementConfig);
  DesignElementConfigs.register(HeadingElementConfig);
  DesignElementConfigs.register(IconElementConfig);
  DesignElementConfigs.register(LabelElementConfig);
  DesignElementConfigs.register(LinkElementConfig);
  DesignElementConfigs.register(NumberElementConfig);
  DesignElementConfigs.register(TextElementConfig);
}
