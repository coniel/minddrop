import { ContentIcon } from '../ContentIcon';
import { ContentListItem } from './ContentListItem';

export default {
  title: 'ui/ContentListItem',
  component: ContentListItem,
};

export const Default: React.FC = () => (
  <div>
    <ContentListItem
      hasChildren
      label="Travel"
      icon={<ContentIcon name="map" />}
    >
      <ContentListItem
        label="Finland"
        icon={<span style={{ fontSize: '14px' }}>🇫🇮</span>}
      />
      <ContentListItem
        label="France"
        icon={<span style={{ fontSize: '14px' }}>🇫🇷</span>}
      />
      <ContentListItem
        hasChildren
        label="Japan"
        icon={<span style={{ fontSize: '14px' }}>🇯🇵</span>}
      >
        <ContentListItem label="Tokyo" icon={<ContentIcon name="pin" />} />
        <ContentListItem label="Kyoto" icon={<ContentIcon name="pin" />} />
        <ContentListItem label="Osaka" icon={<ContentIcon name="pin" />} />
      </ContentListItem>
    </ContentListItem>
  </div>
);
