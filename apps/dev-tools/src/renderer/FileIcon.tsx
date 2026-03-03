/**
 * Renders a colored file type icon based on the file extension.
 */
export const FileIcon: React.FC<{ filename: string }> = ({ filename }) => {
  const config = getIconConfig(filename);

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      style={{ flexShrink: 0 }}
    >
      <text
        x="8"
        y="11.5"
        textAnchor="middle"
        fontSize="8"
        fontWeight="700"
        fontFamily="SF Mono, Fira Code, Cascadia Code, monospace"
        fill={config.color}
      >
        {config.label}
      </text>
    </svg>
  );
};

interface IconConfig {
  /**
   * Short label displayed inside the icon.
   */
  label: string;

  /**
   * Color for the label text.
   */
  color: string;
}

/**
 * Maps a filename to an icon label and color based on its extension.
 */
function getIconConfig(filename: string): IconConfig {
  const extension = filename.split('.').pop()?.toLowerCase() ?? '';

  const configs: Record<string, IconConfig> = {
    ts: { label: 'TS', color: '#519ABA' },
    tsx: { label: 'TX', color: '#519ABA' },
    js: { label: 'JS', color: '#CBCB41' },
    jsx: { label: 'JX', color: '#CBCB41' },
    json: { label: '{}', color: '#CBCB41' },
    css: { label: '#', color: '#6CB6FF' },
    html: { label: '<>', color: '#E06C75' },
    md: { label: 'M', color: '#A0A0A0' },
    yaml: { label: 'Y', color: '#E06C75' },
    yml: { label: 'Y', color: '#E06C75' },
    toml: { label: 'T', color: '#E06C75' },
    sh: { label: '$', color: '#98C379' },
    bash: { label: '$', color: '#98C379' },
    py: { label: 'PY', color: '#5DA5DB' },
    rs: { label: 'RS', color: '#DEA584' },
    go: { label: 'GO', color: '#51B6C4' },
    sql: { label: 'SQ', color: '#E5C07B' },
    xml: { label: '<>', color: '#E06C75' },
    svg: { label: 'SV', color: '#FFB13B' },
    png: { label: 'IM', color: '#C678DD' },
    jpg: { label: 'IM', color: '#C678DD' },
    jpeg: { label: 'IM', color: '#C678DD' },
    gif: { label: 'IM', color: '#C678DD' },
    webp: { label: 'IM', color: '#C678DD' },
    lock: { label: 'LK', color: '#A0A0A0' },
  };

  return configs[extension] ?? { label: '·', color: '#A0A0A0' };
}
