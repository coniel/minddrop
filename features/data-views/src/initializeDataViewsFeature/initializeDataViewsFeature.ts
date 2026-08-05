import {
  DataViewDeletedEvent,
  DataViewDeletedEventData,
  DataViewUpdatedEvent,
  DataViewUpdatedEventData,
  DataViews,
} from '@minddrop/data-views';
import {
  CloseViewEvent,
  CloseViewEventData,
  Events,
  OpenViewEvent,
  OpenViewEventData,
  UpdateViewEvent,
  UpdateViewEventData,
  ViewDescriptor,
} from '@minddrop/events';
import { I18n, i18n } from '@minddrop/i18n';
import { DataViewViewProps } from '../DataViewView';
import {
  DataViewViewName,
  DataViewsViewName,
  EventListenerId,
  OpenDataViewViewEvent,
  OpenDataViewViewEventData,
  OpenDataViewsViewEvent,
} from '../events';
import { locales } from '../locales';

// Unique view instance id used to match data view views in tabs
const dataViewViewId = (dataViewId: string) =>
  `data-views:data-view:${dataViewId}`;

// View instance id of the singleton data views list view
const dataViewsViewId = 'data-views:data-views';

// Icon shown in the data views list view's tab
const DATA_VIEWS_VIEW_ICON = 'content-icon:layers:inherit';

// Descriptor of the data views list view, used both to open it and
// as the breadcrumb parent of data view views
const dataViewsViewDescriptor = (): ViewDescriptor => ({
  view: DataViewsViewName,
  id: dataViewsViewId,
  title: i18n.t('dataViews.labels.views'),
  icon: DATA_VIEWS_VIEW_ICON,
});

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
  // view's view when one is received
  Events.addListener<OpenDataViewViewEventData>(
    OpenDataViewViewEvent,
    EventListenerId,
    ({ data }) => {
      const dataView = DataViews.get(data.dataViewId, false);

      Events.dispatch<OpenViewEventData<DataViewViewProps>>(OpenViewEvent, {
        view: DataViewViewName,
        id: dataViewViewId(data.dataViewId),
        props: { dataViewId: data.dataViewId },
        title: dataView?.name,
        icon: dataView?.icon,
        breadcrumbs: [dataViewsViewDescriptor()],
      });
    },
  );

  // Listen for open data views view events, and open the data
  // views list view when one is received
  Events.addListener(OpenDataViewsViewEvent, EventListenerId, () => {
    Events.dispatch<OpenViewEventData>(
      OpenViewEvent,
      dataViewsViewDescriptor(),
    );
  });

  // Update the data view's open view when the data view changes
  // (e.g. renamed or re-iconed)
  Events.addListener<DataViewUpdatedEventData>(
    DataViewUpdatedEvent,
    EventListenerId,
    ({ data }) => {
      Events.dispatch<UpdateViewEventData>(UpdateViewEvent, {
        id: dataViewViewId(data.updated.id),
        title: data.updated.name,
        icon: data.updated.icon,
      });
    },
  );

  // Close the data view's open view when the data view is deleted
  Events.addListener<DataViewDeletedEventData>(
    DataViewDeletedEvent,
    EventListenerId,
    ({ data }) => {
      Events.dispatch<CloseViewEventData>(CloseViewEvent, {
        id: dataViewViewId(data.id),
      });
    },
  );

  return () => {
    Events.removeListener(OpenDataViewViewEvent, EventListenerId);
    Events.removeListener(OpenDataViewsViewEvent, EventListenerId);
    Events.removeListener(DataViewUpdatedEvent, EventListenerId);
    Events.removeListener(DataViewDeletedEvent, EventListenerId);
  };
}
