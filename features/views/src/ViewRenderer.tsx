import { ViewTypeComponentProps, ViewTypes } from '@minddrop/views';

export const ViewRenderer: React.FC<ViewTypeComponentProps> = ({
  view,
  entries,
}) => {
  const viewType = ViewTypes.use(view.type);

  if (!viewType) {
    return null;
  }

  return <viewType.component view={view} entries={entries || []} />;
};
