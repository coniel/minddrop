import { registerStory } from '@minddrop/dev-tools';
/**
 * WebView.stories.tsx
 * Dev reference for the WebView component.
 */
import { Story, StorySection } from '../dev/Story';
import { WebView } from './WebView';

export const WebViewStories = () => (
  <Story title="WebView">
    <StorySection title="Default">
      <div style={{ width: '100%', height: 800 }}>
        <WebView src="https://minddrop.app" title="MindDrop" />
      </div>
    </StorySection>
  </Story>
);

registerStory({
  group: 'Primitives',
  label: 'WebView',
  component: WebViewStories,
});
