export const OpenMainContentView = 'app:main-content:open';

export type OpenMainContentViewData<P = any> = {
  component: React.ComponentType<P>;
  props?: P;
};
