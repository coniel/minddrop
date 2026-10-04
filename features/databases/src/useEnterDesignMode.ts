import { useCallback } from 'react';
import { Designs } from '@minddrop/designs-next';
import { useTranslation } from '@minddrop/i18n';
import { Views } from '@minddrop/views';
import { DesignsSubviewId } from './constants';

/**
 * Returns a callback entering the database view's design mode by
 * showing the designs subview, a navigation in the tab's history.
 * The database's breadcrumb leads back out.
 *
 * @returns The callback entering design mode.
 */
export function useEnterDesignMode(): () => void {
  const setSubview = Views.useSetSubview();
  const { t } = useTranslation();

  return useCallback(() => {
    setSubview({
      id: DesignsSubviewId,
      title: t('designs.labels.designs'),
      icon: Designs.constants.Icon,
    });
  }, [setSubview, t]);
}
