import { ContainerElementSchema } from '@minddrop/designs';
import { DropEventData } from '@minddrop/selection';
import { mapPropsToClasses } from '@minddrop/ui-primitives';
import { DesignStudioElement } from '../DesignStudioElement';
import { useDesignStudio } from '../DesignStudioProvider';
import { FlexDropContainer } from '../FlexDropContainer';
import './DesignStudioCard.css';

export interface DesignStudioCardProps extends React.HTMLProps<HTMLDivElement> {
  /**
   * The content of the DesignStudioCard.
   */
  children?: React.ReactNode;
}

export const DesignStudioCard: React.FC<DesignStudioCardProps> = ({
  className,
}) => {
  const { onDrop, elements } = useDesignStudio();

  function handleDropInGap(data: DropEventData) {
    onDrop(data);
  }

  if (!elements['root']) {
    return null;
  }

  const rootElement = elements['root'] as ContainerElementSchema;

  return (
    <FlexDropContainer
      id="root"
      direction="row"
      gap={8}
      className={mapPropsToClasses({ className }, 'design-studio-card')}
      onDropInGap={handleDropInGap}
    >
      {rootElement.children.map((id) => (
        <DesignStudioElement key={id} element={elements[id]} />
      ))}
    </FlexDropContainer>
  );
};
