import { ViewTypeComponentProps, ViewTypes } from '@minddrop/views';

export const ViewRenderer: React.FC<ViewTypeComponentProps> = ({
  view,
  elements,
}) => {
  const viewType = ViewTypes.use(view.type);

  if (!viewType) {
    return null;
  }

  return <viewType.component view={view} elements={elements || []} />;
};
