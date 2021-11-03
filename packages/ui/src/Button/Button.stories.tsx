import React from 'react';
import { Button } from './Button';

export default {
  title: 'ui/Button',
  component: Button,
};

const Icon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20.79 11.34L17.45 4.66001C17.2006 4.16036 16.8166 3.74026 16.3414 3.44698C15.8661 3.15371 15.3184 2.99891 14.76 3.00001H9.24C8.68155 2.99891 8.13388 3.15371 7.65864 3.44698C7.18339 3.74026 6.79944 4.16036 6.55 4.66001L3.21 11.34C3.0707 11.6195 2.99878 11.9277 3 12.24V18C3 18.7957 3.31607 19.5587 3.87868 20.1213C4.44129 20.6839 5.20435 21 6 21H18C18.7956 21 19.5587 20.6839 20.1213 20.1213C20.6839 19.5587 21 18.7957 21 18V12.24C21.0012 11.9277 20.9293 11.6195 20.79 11.34ZM8.34 5.55001C8.42386 5.38357 8.55257 5.24388 8.71159 5.1467C8.87062 5.04952 9.05364 4.99871 9.24 5.00001H14.76C14.9464 4.99871 15.1294 5.04952 15.2884 5.1467C15.4474 5.24388 15.5761 5.38357 15.66 5.55001L18.38 11H16C15.7348 11 15.4804 11.1054 15.2929 11.2929C15.1054 11.4804 15 11.7348 15 12V15H9V12C9 11.7348 8.89464 11.4804 8.70711 11.2929C8.51957 11.1054 8.26522 11 8 11H5.62L8.34 5.55001ZM18 19H6C5.73478 19 5.48043 18.8946 5.29289 18.7071C5.10536 18.5196 5 18.2652 5 18V13H7V16C7 16.2652 7.10536 16.5196 7.29289 16.7071C7.48043 16.8946 7.73478 17 8 17H16C16.2652 17 16.5196 16.8946 16.7071 16.7071C16.8946 16.5196 17 16.2652 17 16V13H19V18C19 18.2652 18.8946 18.5196 18.7071 18.7071C18.5196 18.8946 18.2652 19 18 19Z"
      fill="inherit"
    />
  </svg>
);

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
      <Button size="small" startIcon={<Icon />}>
        Neutral
      </Button>
      <Button
        variant="primary"
        size="small"
        startIcon={<Icon />}
        style={{ marginLeft: 12 }}
      >
        Primary
      </Button>
      <Button
        variant="danger"
        size="small"
        startIcon={<Icon />}
        style={{ marginLeft: 12 }}
      >
        Danger
      </Button>
      <Button
        variant="text"
        size="small"
        startIcon={<Icon />}
        style={{ marginLeft: 12 }}
      >
        Text
      </Button>
    </div>
    <div style={{ marginTop: 24 }}>Medium</div>
    <div style={{ paddingTop: 12 }}>
      <Button startIcon={<Icon />}>Neutral</Button>
      <Button variant="primary" startIcon={<Icon />} style={{ marginLeft: 12 }}>
        Primary
      </Button>
      <Button variant="danger" startIcon={<Icon />} style={{ marginLeft: 12 }}>
        Danger
      </Button>
      <Button variant="text" startIcon={<Icon />} style={{ marginLeft: 12 }}>
        Text
      </Button>
    </div>
    <div style={{ marginTop: 24 }}>Large</div>
    <div style={{ paddingTop: 12 }}>
      <Button size="large" startIcon={<Icon />}>
        Neutral
      </Button>
      <Button
        variant="primary"
        size="large"
        startIcon={<Icon />}
        style={{ marginLeft: 12 }}
      >
        Primary
      </Button>
    </div>
    <div style={{ marginTop: 24 }}>Disabled</div>
    <div style={{ paddingTop: 12 }}>
      <Button disabled startIcon={<Icon />}>
        Neutral
      </Button>
      <Button
        disabled
        variant="primary"
        startIcon={<Icon />}
        style={{ marginLeft: 12 }}
      >
        Primary
      </Button>
      <Button
        disabled
        variant="danger"
        startIcon={<Icon />}
        style={{ marginLeft: 12 }}
      >
        Danger
      </Button>
      <Button
        disabled
        variant="text"
        startIcon={<Icon />}
        style={{ marginLeft: 12 }}
      >
        Text
      </Button>
    </div>
    <div style={{ marginTop: 24 }}>Full width</div>
    <div style={{ paddingTop: 12, maxWidth: 350 }}>
      <Button fullWidth startIcon={<Icon />}>
        Neutral
      </Button>
      <Button
        fullWidth
        variant="primary"
        startIcon={<Icon />}
        style={{ marginTop: 12 }}
      >
        Primary
      </Button>
      <Button
        fullWidth
        variant="danger"
        startIcon={<Icon />}
        style={{ marginTop: 12 }}
      >
        Danger
      </Button>
      <Button
        fullWidth
        variant="text"
        startIcon={<Icon />}
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
      <Button size="small" endIcon={<Icon />}>
        Neutral
      </Button>
      <Button
        variant="primary"
        size="small"
        endIcon={<Icon />}
        style={{ marginLeft: 12 }}
      >
        Primary
      </Button>
      <Button
        variant="danger"
        size="small"
        endIcon={<Icon />}
        style={{ marginLeft: 12 }}
      >
        Danger
      </Button>
      <Button
        variant="text"
        size="small"
        endIcon={<Icon />}
        style={{ marginLeft: 12 }}
      >
        Text
      </Button>
    </div>
    <div style={{ marginTop: 24 }}>Medium</div>
    <div style={{ paddingTop: 12 }}>
      <Button endIcon={<Icon />}>Neutral</Button>
      <Button variant="primary" endIcon={<Icon />} style={{ marginLeft: 12 }}>
        Primary
      </Button>
      <Button variant="danger" endIcon={<Icon />} style={{ marginLeft: 12 }}>
        Danger
      </Button>
      <Button variant="text" endIcon={<Icon />} style={{ marginLeft: 12 }}>
        Text
      </Button>
    </div>
    <div style={{ marginTop: 24 }}>Large</div>
    <div style={{ paddingTop: 12 }}>
      <Button size="large" endIcon={<Icon />}>
        Neutral
      </Button>
      <Button
        variant="primary"
        size="large"
        endIcon={<Icon />}
        style={{ marginLeft: 12 }}
      >
        Primary
      </Button>
    </div>
    <div style={{ marginTop: 24 }}>Disabled</div>
    <div style={{ paddingTop: 12 }}>
      <Button disabled endIcon={<Icon />}>
        Neutral
      </Button>
      <Button
        disabled
        variant="primary"
        endIcon={<Icon />}
        style={{ marginLeft: 12 }}
      >
        Primary
      </Button>
      <Button
        disabled
        variant="danger"
        endIcon={<Icon />}
        style={{ marginLeft: 12 }}
      >
        Danger
      </Button>
      <Button
        disabled
        variant="text"
        endIcon={<Icon />}
        style={{ marginLeft: 12 }}
      >
        Text
      </Button>
    </div>
    <div style={{ marginTop: 24 }}>Full width</div>
    <div style={{ paddingTop: 12, maxWidth: 350 }}>
      <Button fullWidth endIcon={<Icon />}>
        Neutral
      </Button>
      <Button
        fullWidth
        variant="primary"
        endIcon={<Icon />}
        style={{ marginTop: 12 }}
      >
        Primary
      </Button>
      <Button
        fullWidth
        variant="danger"
        endIcon={<Icon />}
        style={{ marginTop: 12 }}
      >
        Danger
      </Button>
      <Button
        fullWidth
        variant="text"
        endIcon={<Icon />}
        style={{ marginTop: 12 }}
      >
        Text
      </Button>
    </div>
  </div>
);
