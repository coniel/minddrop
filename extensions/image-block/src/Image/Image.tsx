import { useEffect, useRef, useState } from 'react';
import { BlockVariantProps, useApi } from '@minddrop/extension';
import './Image.css';

export const ImageCard: React.FC<BlockVariantProps> = (props) => {
  if (props.block.file) {
    return <HasImageFile {...props} />;
  }

  return <div>No image file</div>;
};

const HasImageFile: React.FC<BlockVariantProps> = ({ block }) => {
  const {
    Fs: { useImageSrc, concatPath },
    Utils,
    Ui: { Dialog, DialogPortal, DialogOverlay, DialogContent },
  } = useApi();
  const parentDir = Utils.useParentDir();
  const src = useImageSrc(concatPath(parentDir, block.file!));
  const [dialogOpen, toggleDialogOpen, setDialogOpen] = Utils.useToggle(false);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement | null>(null);
  const lastPosition = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);

  useEffect(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, [dialogOpen]);

  const handleMouseDown = (event: React.MouseEvent) => {
    isDragging.current = true;
    lastPosition.current = { x: event.clientX, y: event.clientY };
    imageRef.current!.style.cursor = 'grabbing';
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (isDragging.current) {
      const dx = event.clientX - lastPosition.current.x;
      const dy = event.clientY - lastPosition.current.y;
      setPosition((prev) => ({
        x: prev.x + dx,
        y: prev.y + dy,
      }));
      lastPosition.current = { x: event.clientX, y: event.clientY };
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    imageRef.current!.style.cursor = 'grab';
  };

  if (!src) {
    return null;
  }

  return (
    <>
      <img src={src} alt="" onDoubleClick={toggleDialogOpen} />
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogPortal>
          <DialogOverlay />
          <DialogContent
            className="image-dialog-content"
            onClick={toggleDialogOpen}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <img
              src={src}
              ref={imageRef}
              alt=""
              onClick={(event) => event.stopPropagation()}
              onDoubleClick={(event) => {
                event.stopPropagation();

                if (!isDragging.current) {
                  if (zoom !== 1) {
                    setPosition({ x: 0, y: 0 });
                  }
                  setZoom((prev) => (prev === 1 ? 2 : 1));
                }
              }}
              style={{
                cursor: 'grab',
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
              }}
              onMouseDown={handleMouseDown}
              draggable={false}
            />
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  );
};
