import { useTranslation } from '@minddrop/i18n';
import { Icon } from '@minddrop/ui-primitives';
import '../design-elements/elementPlaceholder.css';
import './EmptyDropHint.css';

/**
 * Renders the drop hint filling an empty container or layout root
 * in the studio, giving it a visible size to drop elements onto.
 */
export const EmptyDropHint: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="designs-empty-drop-hint designs-element-placeholder">
      <Icon name="box" size={24} className="designs-empty-drop-hint-icon" />
      <span className="designs-empty-drop-hint-text">
        {t('design-studio.elements.container-empty-hint')}
      </span>
    </div>
  );
};
