import { useApi } from '@minddrop/extension';

export const LocalImage: React.FC<{ path: string; className?: string }> = ({
  path,
  ...other
}) => {
  const { Fs } = useApi();

  const src = Fs.useImageSrc(path);

  if (!src) {
    return null;
  }

  return (
    <img
      src={src}
      alt={path}
      style={{ maxWidth: '100%', maxHeight: '100%' }}
      {...other}
    />
  );
};
