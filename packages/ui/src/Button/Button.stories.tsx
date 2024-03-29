import React from 'react';
import { Button } from './Button';

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
      <Button variant="contained" size="small" style={{ marginLeft: 12 }}>
        Contained
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
      <Button variant="contained" style={{ marginLeft: 12 }}>
        Contained
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
      <Button variant="contained" size="large" style={{ marginLeft: 12 }}>
        Contained
      </Button>
    </div>
    <div style={{ marginTop: 24 }}>Disabled</div>
    <div style={{ paddingTop: 12 }}>
      <Button disabled>Neutral</Button>
      <Button disabled variant="primary" style={{ marginLeft: 12 }}>
        Primary
      </Button>
      <Button disabled variant="contained" style={{ marginLeft: 12 }}>
        Contained
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
      <Button fullWidth variant="contained" style={{ marginTop: 12 }}>
        Contained
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
      <Button size="small" startIcon="settings">
        Neutral
      </Button>
      <Button
        variant="primary"
        size="small"
        startIcon="settings"
        style={{ marginLeft: 12 }}
      >
        Primary
      </Button>
      <Button
        variant="danger"
        size="small"
        startIcon="settings"
        style={{ marginLeft: 12 }}
      >
        Danger
      </Button>
      <Button
        variant="text"
        size="small"
        startIcon="settings"
        style={{ marginLeft: 12 }}
      >
        Text
      </Button>
    </div>
    <div style={{ marginTop: 24 }}>Medium</div>
    <div style={{ paddingTop: 12 }}>
      <Button startIcon="settings">Neutral</Button>
      <Button variant="primary" startIcon="settings" style={{ marginLeft: 12 }}>
        Primary
      </Button>
      <Button variant="danger" startIcon="settings" style={{ marginLeft: 12 }}>
        Danger
      </Button>
      <Button variant="text" startIcon="settings" style={{ marginLeft: 12 }}>
        Text
      </Button>
    </div>
    <div style={{ marginTop: 24 }}>Large</div>
    <div style={{ paddingTop: 12 }}>
      <Button size="large" startIcon="settings">
        Neutral
      </Button>
      <Button
        variant="primary"
        size="large"
        startIcon="settings"
        style={{ marginLeft: 12 }}
      >
        Primary
      </Button>
    </div>
    <div style={{ marginTop: 24 }}>Disabled</div>
    <div style={{ paddingTop: 12 }}>
      <Button disabled startIcon="settings">
        Neutral
      </Button>
      <Button
        disabled
        variant="primary"
        startIcon="settings"
        style={{ marginLeft: 12 }}
      >
        Primary
      </Button>
      <Button
        disabled
        variant="danger"
        startIcon="settings"
        style={{ marginLeft: 12 }}
      >
        Danger
      </Button>
      <Button
        disabled
        variant="text"
        startIcon="settings"
        style={{ marginLeft: 12 }}
      >
        Text
      </Button>
    </div>
    <div style={{ marginTop: 24 }}>Full width</div>
    <div style={{ paddingTop: 12, maxWidth: 350 }}>
      <Button fullWidth startIcon="settings">
        Neutral
      </Button>
      <Button
        fullWidth
        variant="primary"
        startIcon="settings"
        style={{ marginTop: 12 }}
      >
        Primary
      </Button>
      <Button
        fullWidth
        variant="danger"
        startIcon="settings"
        style={{ marginTop: 12 }}
      >
        Danger
      </Button>
      <Button
        fullWidth
        variant="text"
        startIcon="settings"
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
      <Button size="small" endIcon="settings">
        Neutral
      </Button>
      <Button
        variant="primary"
        size="small"
        endIcon="settings"
        style={{ marginLeft: 12 }}
      >
        Primary
      </Button>
      <Button
        variant="danger"
        size="small"
        endIcon="settings"
        style={{ marginLeft: 12 }}
      >
        Danger
      </Button>
      <Button
        variant="text"
        size="small"
        endIcon="settings"
        style={{ marginLeft: 12 }}
      >
        Text
      </Button>
    </div>
    <div style={{ marginTop: 24 }}>Medium</div>
    <div style={{ paddingTop: 12 }}>
      <Button endIcon="settings">Neutral</Button>
      <Button variant="primary" endIcon="settings" style={{ marginLeft: 12 }}>
        Primary
      </Button>
      <Button variant="danger" endIcon="settings" style={{ marginLeft: 12 }}>
        Danger
      </Button>
      <Button variant="text" endIcon="settings" style={{ marginLeft: 12 }}>
        Text
      </Button>
    </div>
    <div style={{ marginTop: 24 }}>Large</div>
    <div style={{ paddingTop: 12 }}>
      <Button size="large" endIcon="settings">
        Neutral
      </Button>
      <Button
        variant="primary"
        size="large"
        endIcon="settings"
        style={{ marginLeft: 12 }}
      >
        Primary
      </Button>
    </div>
    <div style={{ marginTop: 24 }}>Disabled</div>
    <div style={{ paddingTop: 12 }}>
      <Button disabled endIcon="settings">
        Neutral
      </Button>
      <Button
        disabled
        variant="primary"
        endIcon="settings"
        style={{ marginLeft: 12 }}
      >
        Primary
      </Button>
      <Button
        disabled
        variant="danger"
        endIcon="settings"
        style={{ marginLeft: 12 }}
      >
        Danger
      </Button>
      <Button
        disabled
        variant="text"
        endIcon="settings"
        style={{ marginLeft: 12 }}
      >
        Text
      </Button>
    </div>
    <div style={{ marginTop: 24 }}>Full width</div>
    <div style={{ paddingTop: 12, maxWidth: 350 }}>
      <Button fullWidth endIcon="settings">
        Neutral
      </Button>
      <Button
        fullWidth
        variant="primary"
        endIcon="settings"
        style={{ marginTop: 12 }}
      >
        Primary
      </Button>
      <Button
        fullWidth
        variant="danger"
        endIcon="settings"
        style={{ marginTop: 12 }}
      >
        Danger
      </Button>
      <Button
        fullWidth
        variant="text"
        endIcon="settings"
        style={{ marginTop: 12 }}
      >
        Text
      </Button>
    </div>
  </div>
);
