import { ContainerElementSchema } from '@minddrop/designs';

export interface ContainerElementProps {
  element?: ContainerElementSchema;
  children: React.ReactNode;
}

export const ContainerElement: React.FC<ContainerElementProps> = ({
  element,
  children,
}) => {
  return <div>{children}</div>;
};
