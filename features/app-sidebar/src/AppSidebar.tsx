import { DatabasesSidebarMenu } from '@minddrop/feature-databases';
import { Sidebar, SidebarProps } from './Sidebar';

export const AppSidebar: React.FC<SidebarProps> = ({ ...other }) => {
  return (
    <Sidebar {...other}>
      <DatabasesSidebarMenu />
    </Sidebar>
  );
};
