import { useApi } from '@minddrop/extension';

export const LocalImage: React.FC<{
  file: string;
  blockId: string;
  className?: string;
}> = ({ file, blockId, ...other }) => {
  const {
    Assets: { getPath },
    Fs: { useImageSrc },
  } = useApi();

  const src = useImageSrc(getPath(blockId, file));

  if (!src) {
    return null;
  }

  return (
    <img
      src={src}
      alt=""
      style={{ maxWidth: '100%', maxHeight: '100%' }}
      {...other}
    />
  );
};
