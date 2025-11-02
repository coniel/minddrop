export const OpenMainContentView = 'app:main-content:open';
export const OpenRightPanel = 'app:right-panel:open';
export const CloseRightPanel = 'app:right-panel:close';

export type OpenMainContentViewData<P = any> = {
  component: React.ComponentType<P>;
  props?: P;
};
