import React from 'react';
import { Button } from './Button';
import { Icon } from '../Icon';

export default {
  title: 'ui/Button',
  component: Button,
};

export const VariantsAndSizes: React.FC = () => (
  <div>
    <div>Small</div>
    <div style={{ paddingTop: 12 }}>
      <Button size="small">Neutral</Button>
      <Button variant="primary" size="small" style={{ marginLeft: 12 }}>
        Primary
      </Button>
      <Button variant="danger" size="small" style={{ marginLeft: 12 }}>
        Danger
      </Button>
      <Button variant="text" size="small" style={{ marginLeft: 12 }}>
        Text
      </Button>
    </div>
    <div style={{ marginTop: 24 }}>Medium</div>
    <div style={{ paddingTop: 12 }}>
      <Button>Neutral</Button>
      <Button variant="primary" style={{ marginLeft: 12 }}>
        Primary
      </Button>
      <Button variant="danger" style={{ marginLeft: 12 }}>
        Danger
      </Button>
      <Button variant="text" style={{ marginLeft: 12 }}>
        Text
      </Button>
    </div>
    <div style={{ marginTop: 24 }}>Large</div>
    <div style={{ paddingTop: 12 }}>
      <Button size="large">Neutral</Button>
      <Button variant="primary" size="large" style={{ marginLeft: 12 }}>
        Primary
      </Button>
    </div>
    <div style={{ marginTop: 24 }}>Disabled</div>
    <div style={{ paddingTop: 12 }}>
      <Button disabled>Neutral</Button>
      <Button disabled variant="primary" style={{ marginLeft: 12 }}>
        Primary
      </Button>
      <Button disabled variant="danger" style={{ marginLeft: 12 }}>
        Danger
      </Button>
      <Button disabled variant="text" style={{ marginLeft: 12 }}>
        Text
      </Button>
    </div>
    <div style={{ marginTop: 24 }}>Full width</div>
    <div style={{ paddingTop: 12, maxWidth: 350 }}>
      <Button fullWidth>Neutral</Button>
      <Button fullWidth variant="primary" style={{ marginTop: 12 }}>
        Primary
      </Button>
      <Button fullWidth variant="danger" style={{ marginTop: 12 }}>
        Danger
      </Button>
      <Button fullWidth variant="text" style={{ marginTop: 12 }}>
        Text
      </Button>
    </div>
  </div>
);

export const RenderAsLink: React.FC = () => (
  <div>
    <div style={{ paddingTop: 12 }}>
      <Button href="https://minddrop.app" target="_blank">
        Neutral
      </Button>
      <Button
        href="https://minddrop.app"
        variant="primary"
        target="_blank"
        style={{ marginLeft: 12 }}
      >
        Primary
      </Button>
      <Button
        href="https://minddrop.app"
        variant="danger"
        target="_blank"
        style={{ marginLeft: 12 }}
      >
        Danger
      </Button>
      <Button
        href="https://minddrop.app"
        variant="text"
        target="_blank"
        style={{ marginLeft: 12 }}
      >
        Text
      </Button>
    </div>
  </div>
);

export const WithStartIcon: React.FC = () => (
  <div>
    <div>Small</div>
    <div style={{ paddingTop: 12 }}>
      <Button size="small" startIcon={<Icon name="settings" />}>
        Neutral
      </Button>
      <Button
        variant="primary"
        size="small"
        startIcon={<Icon name="settings" />}
        style={{ marginLeft: 12 }}
      >
        Primary
      </Button>
      <Button
        variant="danger"
        size="small"
        startIcon={<Icon name="settings" />}
        style={{ marginLeft: 12 }}
      >
        Danger
      </Button>
      <Button
        variant="text"
        size="small"
        startIcon={<Icon name="settings" />}
        style={{ marginLeft: 12 }}
      >
        Text
      </Button>
    </div>
    <div style={{ marginTop: 24 }}>Medium</div>
    <div style={{ paddingTop: 12 }}>
      <Button startIcon={<Icon name="settings" />}>Neutral</Button>
      <Button
        variant="primary"
        startIcon={<Icon name="settings" />}
        style={{ marginLeft: 12 }}
      >
        Primary
      </Button>
      <Button
        variant="danger"
        startIcon={<Icon name="settings" />}
        style={{ marginLeft: 12 }}
      >
        Danger
      </Button>
      <Button
        variant="text"
        startIcon={<Icon name="settings" />}
        style={{ marginLeft: 12 }}
      >
        Text
      </Button>
    </div>
    <div style={{ marginTop: 24 }}>Large</div>
    <div style={{ paddingTop: 12 }}>
      <Button size="large" startIcon={<Icon name="settings" />}>
        Neutral
      </Button>
      <Button
        variant="primary"
        size="large"
        startIcon={<Icon name="settings" />}
        style={{ marginLeft: 12 }}
      >
        Primary
      </Button>
    </div>
    <div style={{ marginTop: 24 }}>Disabled</div>
    <div style={{ paddingTop: 12 }}>
      <Button disabled startIcon={<Icon name="settings" />}>
        Neutral
      </Button>
      <Button
        disabled
        variant="primary"
        startIcon={<Icon name="settings" />}
        style={{ marginLeft: 12 }}
      >
        Primary
      </Button>
      <Button
        disabled
        variant="danger"
        startIcon={<Icon name="settings" />}
        style={{ marginLeft: 12 }}
      >
        Danger
      </Button>
      <Button
        disabled
        variant="text"
        startIcon={<Icon name="settings" />}
        style={{ marginLeft: 12 }}
      >
        Text
      </Button>
    </div>
    <div style={{ marginTop: 24 }}>Full width</div>
    <div style={{ paddingTop: 12, maxWidth: 350 }}>
      <Button fullWidth startIcon={<Icon name="settings" />}>
        Neutral
      </Button>
      <Button
        fullWidth
        variant="primary"
        startIcon={<Icon name="settings" />}
        style={{ marginTop: 12 }}
      >
        Primary
      </Button>
      <Button
        fullWidth
        variant="danger"
        startIcon={<Icon name="settings" />}
        style={{ marginTop: 12 }}
      >
        Danger
      </Button>
      <Button
        fullWidth
        variant="text"
        startIcon={<Icon name="settings" />}
        style={{ marginTop: 12 }}
      >
        Text
      </Button>
    </div>
  </div>
);

export const WithEndIcon: React.FC = () => (
  <div>
    <div>Small</div>
    <div style={{ paddingTop: 12 }}>
      <Button size="small" endIcon={<Icon name="settings" />}>
        Neutral
      </Button>
      <Button
        variant="primary"
        size="small"
        endIcon={<Icon name="settings" />}
        style={{ marginLeft: 12 }}
      >
        Primary
      </Button>
      <Button
        variant="danger"
        size="small"
        endIcon={<Icon name="settings" />}
        style={{ marginLeft: 12 }}
      >
        Danger
      </Button>
      <Button
        variant="text"
        size="small"
        endIcon={<Icon name="settings" />}
        style={{ marginLeft: 12 }}
      >
        Text
      </Button>
    </div>
    <div style={{ marginTop: 24 }}>Medium</div>
    <div style={{ paddingTop: 12 }}>
      <Button endIcon={<Icon name="settings" />}>Neutral</Button>
      <Button
        variant="primary"
        endIcon={<Icon name="settings" />}
        style={{ marginLeft: 12 }}
      >
        Primary
      </Button>
      <Button
        variant="danger"
        endIcon={<Icon name="settings" />}
        style={{ marginLeft: 12 }}
      >
        Danger
      </Button>
      <Button
        variant="text"
        endIcon={<Icon name="settings" />}
        style={{ marginLeft: 12 }}
      >
        Text
      </Button>
    </div>
    <div style={{ marginTop: 24 }}>Large</div>
    <div style={{ paddingTop: 12 }}>
      <Button size="large" endIcon={<Icon name="settings" />}>
        Neutral
      </Button>
      <Button
        variant="primary"
        size="large"
        endIcon={<Icon name="settings" />}
        style={{ marginLeft: 12 }}
      >
        Primary
      </Button>
    </div>
    <div style={{ marginTop: 24 }}>Disabled</div>
    <div style={{ paddingTop: 12 }}>
      <Button disabled endIcon={<Icon name="settings" />}>
        Neutral
      </Button>
      <Button
        disabled
        variant="primary"
        endIcon={<Icon name="settings" />}
        style={{ marginLeft: 12 }}
      >
        Primary
      </Button>
      <Button
        disabled
        variant="danger"
        endIcon={<Icon name="settings" />}
        style={{ marginLeft: 12 }}
      >
        Danger
      </Button>
      <Button
        disabled
        variant="text"
        endIcon={<Icon name="settings" />}
        style={{ marginLeft: 12 }}
      >
        Text
      </Button>
    </div>
    <div style={{ marginTop: 24 }}>Full width</div>
    <div style={{ paddingTop: 12, maxWidth: 350 }}>
      <Button fullWidth endIcon={<Icon name="settings" />}>
        Neutral
      </Button>
      <Button
        fullWidth
        variant="primary"
        endIcon={<Icon name="settings" />}
        style={{ marginTop: 12 }}
      >
        Primary
      </Button>
      <Button
        fullWidth
        variant="danger"
        endIcon={<Icon name="settings" />}
        style={{ marginTop: 12 }}
      >
        Danger
      </Button>
      <Button
        fullWidth
        variant="text"
        endIcon={<Icon name="settings" />}
        style={{ marginTop: 12 }}
      >
        Text
      </Button>
    </div>
  </div>
);
