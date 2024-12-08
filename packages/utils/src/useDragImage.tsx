import { useRef, useState } from 'react';
import React from 'react';
import { createContext } from './createContext';

interface DragImageProviderValue {
  DragImage: React.ReactElement | null;
  setDragImageComponent: (element: React.ReactElement | null) => void;
  dragImageContainerRef: React.MutableRefObject<HTMLDivElement | null>;
}

interface DragImageProviderProps {
  children: React.ReactNode;
}

const [hook, Provider] = createContext<DragImageProviderValue>();
const useDragImageRenderer = hook;

/**
 * Provider for drag image component. Designed to be used at the root of the application.
 *
 * Renders the provided drag image component in a container off screen. The container is
 * then used as the drag image using the `useDragImage` hook.
 *
 * Useful when rendering drag images containing elements which rely on the context of the
 * application (e.g. icons).
 */
export const DragImageProvider: React.FC<DragImageProviderProps> = ({
  children,
}) => {
  const dragImageContainerRef = useRef<HTMLDivElement | null>(null);
  const [DragImage, setDragImage] = useState<React.ReactElement | null>(null);

  return (
    <Provider
      value={{
        setDragImageComponent: setDragImage,
        DragImage,
        dragImageContainerRef,
      }}
    >
      <>
        {children}
        <div
          ref={dragImageContainerRef}
          style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}
        >
          {DragImage || ''}
        </div>
      </>
    </Provider>
  );
};

/**
 * Hook for setting a drag image on a drag event.
 *
 * Renders the provided component as a drag image when the `setDragImage` function is called.
 * The drag image is then set on the `dataTransfer` object of the drag event.
 *
 * The drag image is cleared when the `clearDragImage` function is called. This should be done
 * when the drag event ends.
 *
 * Useful when rendering drag images containing elements which rely on the context of the
 * application (e.g. icons).
 *
 * @param dragImageComponent - The component to render as the drag image.
 * @returns Functions for setting and clearing the drag image.
 */
export const useDragImage = (dragImageComponent: React.ReactElement) => {
  const { setDragImageComponent, dragImageContainerRef } =
    useDragImageRenderer();

  const setDragImage = (event: React.DragEvent): void => {
    if (!dragImageContainerRef.current) {
      return;
    }

    setDragImageComponent(dragImageComponent);
    event.dataTransfer?.setDragImage(dragImageContainerRef.current, 0, 0);
  };

  const clearDragImage = (): void => {
    setDragImageComponent(null);
  };

  return { setDragImage, clearDragImage };
};
