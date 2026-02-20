import { ContainerStyles, DefaultContainerStyles } from '@minddrop/designs';

export function createContainerStyleObject(style?: Partial<ContainerStyles>) {
  return {
    ...DefaultContainerStyles,
    ...(style ?? {}),
  };
}
