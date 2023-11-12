---
to: packages/ui/src/<%= name %>/<%= name %>.tsx
---
import { mapPropsToClasses } from '@minddrop/utils';
import './<%= name %>.css';

export interface <%= name %>Props extends React.HTMLProps<HTMLDivElement> {
  /**
   * The content of the <%= name %>.
   */
  children?: React.ReactNode;
}

export const <%= name %>: React.FC<<%= name %>Props> = ({ children, className, ...other }) => {
  return (
    <div className={mapPropsToClasses({ className }, '<%= h.toKebabCase(name) %>')} {...other}>
      {children}
    </div>
  );
};
