import { ContentViewTypes, ViewDataSourceType } from '@minddrop/content-views';
import { DesignElementSettingControlProps } from '@minddrop/designs-next';
import { useTranslation } from '@minddrop/i18n';
import {
  RadioToggleHoverMenu,
  RadioToggleHoverMenuOption,
} from '@minddrop/ui-primitives';
import { CollectionElement } from '../CollectionElement.types';
import { DefaultCollectionViewType } from '../constants';

// The data source the embedded view draws from
const CollectionDataSources: ViewDataSourceType[] = ['collection'];

/**
 * Renders the view type choices as a hover menu, one per registered
 * view type supporting the collection data source.
 */
export const CollectionViewTypeMenu: React.FC<
  DesignElementSettingControlProps<CollectionElement>
> = ({ element, onChange }) => {
  const { t } = useTranslation();
  // Read the view types supporting the collection data source
  const viewTypes = ContentViewTypes.useForDataSources(CollectionDataSources);

  // Resolve the element's view type, gallery by default
  const viewType = element.viewType ?? DefaultCollectionViewType;

  // Map the view types to menu options
  const options: RadioToggleHoverMenuOption<string>[] = viewTypes.map(
    (type) => ({
      value: type.type,
      content: t(type.name),
      label: t(type.name),
      tooltip: { title: type.name },
    }),
  );

  // Applies the chosen view type
  function handleViewTypeChange(viewType: string) {
    onChange({ viewType });
  }

  return (
    <RadioToggleHoverMenu<string>
      options={options}
      value={viewType}
      label={t('databases.elements.collection.viewType.label')}
      onValueChange={handleViewTypeChange}
    />
  );
};
