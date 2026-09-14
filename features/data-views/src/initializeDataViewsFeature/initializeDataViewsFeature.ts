import { DataViews } from '@minddrop/data-views';
import { Events } from '@minddrop/events';
import { I18n, i18n } from '@minddrop/i18n';
import { Views } from '@minddrop/views';
import {
  DataViewViewName,
  DataViewsViewName,
  EventListenerId,
  NewDataViewViewId,
  NewDataViewViewName,
  OpenDataViewViewEvent,
  OpenDataViewsViewEvent,
  OpenNewDataViewViewEvent,
} from '../events';
import { locales } from '../locales';
import { resolveDataViewViewId } from '../utils';

// View instance id of the singleton data views list view, which is
// labelled and iconed from its registration.
const dataViewsViewId = 'data-views:data-views';

// Icon shown in the new data view view's tab
const NEW_DATA_VIEW_VIEW_ICON = 'lucide:plus:inherit';

/**
 * Initializes the data views feature by registering translations
 * and event listeners for opening, updating, and closing data
 * view views.
 *
 * @returns A cleanup function which removes the event listeners.
 */
export function initializeDataViewsFeature(): VoidFunction {
  // Register the feature's translations
  I18n.registerTranslations(locales);

  // Listen for open data view view events, and open the data
  // view's view when one is received.
  Events.addListener(OpenDataViewViewEvent, EventListenerId, (data) => {
    const dataView = DataViews.get(data.dataViewId, false);

    // Open the data view's view. The feature has no tab access, so
    // new-tab opens fall back to in place, as do dialog and panel.
    Events.dispatch(Views.events.Open, {
      viewAreaId: data.viewAreaId,
      sourcePane: data.sourcePane,
      view: DataViewViewName,
      id: resolveDataViewViewId(data.dataViewId),
      props: { dataViewId: data.dataViewId },
      split: data.openMode === 'split',
      title: dataView?.name,
      icon: dataView?.icon,
    });
  });

  // Listen for open data views view events, and open the data
  // views list view when one is received.
  Events.addListener(OpenDataViewsViewEvent, EventListenerId, (data) => {
    // Open the data views list view. The feature has no tab access,
    // so new-tab opens fall back to in place, as do dialog and panel
    Events.dispatch(Views.events.Open, {
      viewAreaId: data?.viewAreaId,
      sourcePane: data?.sourcePane,
      view: DataViewsViewName,
      id: dataViewsViewId,
      split: data?.openMode === 'split',
    });
  });

  // Listen for open new data view view events, and open the view
  // creation view when one is received.
  Events.addListener(OpenNewDataViewViewEvent, EventListenerId, (data) => {
    // Open the view creation view. The feature has no tab access, so
    // new-tab opens fall back to in place, as do dialog and panel.
    Events.dispatch(Views.events.Open, {
      viewAreaId: data.viewAreaId,
      sourcePane: data.sourcePane,
      view: NewDataViewViewName,
      id: NewDataViewViewId,
      props: { viewType: data.viewType },
      split: data.openMode === 'split',
      title: i18n.t('dataViews.labels.new'),
      icon: NEW_DATA_VIEW_VIEW_ICON,
    });
  });

  // Update the data view's open view when the data view changes
  // (e.g. renamed or re-iconed)
  Events.addListener(DataViews.events.Updated, EventListenerId, (data) => {
    Events.dispatch(Views.events.Update, {
      id: resolveDataViewViewId(data.updated.id),
      title: data.updated.name,
      icon: data.updated.icon,
    });
  });

  // Close the data view's open view when the data view is deleted
  Events.addListener(DataViews.events.Deleted, EventListenerId, (data) => {
    Events.dispatch(Views.events.Close, {
      id: resolveDataViewViewId(data.id),
    });
  });

  return () => {
    Events.removeListener(OpenDataViewViewEvent, EventListenerId);
    Events.removeListener(OpenDataViewsViewEvent, EventListenerId);
    Events.removeListener(OpenNewDataViewViewEvent, EventListenerId);
    Events.removeListener(DataViews.events.Updated, EventListenerId);
    Events.removeListener(DataViews.events.Deleted, EventListenerId);
  };
}
