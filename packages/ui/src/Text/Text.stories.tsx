import React from 'react';
import { Text } from './Text';

export default {
  title: 'ui/Text',
  component: Text,
};

export const ColorsWeightsAndSizes: React.FC = () => (
  <div>
    <Text
      size="large"
      color="light"
      weight="semibold"
      component="div"
      style={{ marginBottom: 10 }}
    >
      Colors
    </Text>
    <Text color="regular">Regular</Text>
    <Text color="light" style={{ marginLeft: 20 }}>
      Light
    </Text>
    <Text
      color="contrast"
      style={{ marginLeft: 20, backgroundColor: 'hsl(195 7.1% 11%)' }}
    >
      Contrast
    </Text>

    <Text
      size="large"
      color="light"
      weight="semibold"
      component="div"
      style={{ marginBottom: 10, marginTop: 30 }}
    >
      Weights
    </Text>
    <Text weight="light">Light</Text>
    <Text weight="regular" style={{ marginLeft: 20 }}>
      Regular
    </Text>
    <Text weight="medium" style={{ marginLeft: 20 }}>
      Medium
    </Text>
    <Text weight="semibold" style={{ marginLeft: 20 }}>
      Semibold
    </Text>
    <Text weight="bold" style={{ marginLeft: 20 }}>
      Bold
    </Text>
    <Text weight="heavy" style={{ marginLeft: 20 }}>
      Heavy
    </Text>

    <Text
      size="large"
      color="light"
      weight="semibold"
      component="div"
      style={{ marginBottom: 10, marginTop: 30 }}
    >
      Sizes
    </Text>
    <Text size="tiny">Tiny</Text>
    <Text size="small" style={{ marginLeft: 20 }}>
      Small
    </Text>
    <Text size="regular" style={{ marginLeft: 20 }}>
      Regular
    </Text>
    <Text size="large" style={{ marginLeft: 20 }}>
      Large
    </Text>
    <Text size="title" style={{ marginLeft: 20 }}>
      Title
    </Text>
  </div>
);

export const Showcase: React.FC = () => (
  <div>
    <div style={{ padding: 16 }}>
      <div>
        <Text size="tiny" weight="light" color="regular">
          Tiny
        </Text>
        <Text
          size="tiny"
          weight="regular"
          color="regular"
          style={{ marginLeft: 12 }}
        >
          Tiny
        </Text>
        <Text
          size="tiny"
          weight="medium"
          color="regular"
          style={{ marginLeft: 12 }}
        >
          Tiny
        </Text>
        <Text
          size="tiny"
          weight="semibold"
          color="regular"
          style={{ marginLeft: 12 }}
        >
          Tiny
        </Text>
        <Text
          size="tiny"
          weight="bold"
          color="regular"
          style={{ marginLeft: 12 }}
        >
          Tiny
        </Text>
        <Text
          size="tiny"
          weight="heavy"
          color="regular"
          style={{ marginLeft: 12 }}
        >
          Tiny
        </Text>
      </div>
      <div style={{ marginTop: 12 }}>
        <Text size="small" weight="light" color="regular">
          Small
        </Text>
        <Text
          size="small"
          weight="regular"
          color="regular"
          style={{ marginLeft: 12 }}
        >
          Small
        </Text>
        <Text
          size="small"
          weight="medium"
          color="regular"
          style={{ marginLeft: 12 }}
        >
          Small
        </Text>
        <Text
          size="small"
          weight="semibold"
          color="regular"
          style={{ marginLeft: 12 }}
        >
          Small
        </Text>
        <Text
          size="small"
          weight="bold"
          color="regular"
          style={{ marginLeft: 12 }}
        >
          Small
        </Text>
        <Text
          size="small"
          weight="heavy"
          color="regular"
          style={{ marginLeft: 12 }}
        >
          Small
        </Text>
      </div>
      <div style={{ marginTop: 12 }}>
        <Text size="regular" weight="light" color="regular">
          Regular
        </Text>
        <Text
          size="regular"
          weight="regular"
          color="regular"
          style={{ marginLeft: 12 }}
        >
          Regular
        </Text>
        <Text
          size="regular"
          weight="medium"
          color="regular"
          style={{ marginLeft: 12 }}
        >
          Regular
        </Text>
        <Text
          size="regular"
          weight="semibold"
          color="regular"
          style={{ marginLeft: 12 }}
        >
          Regular
        </Text>
        <Text
          size="regular"
          weight="bold"
          color="regular"
          style={{ marginLeft: 12 }}
        >
          Regular
        </Text>
        <Text
          size="regular"
          weight="heavy"
          color="regular"
          style={{ marginLeft: 12 }}
        >
          Regular
        </Text>
      </div>
      <div style={{ marginTop: 12 }}>
        <Text size="large" weight="light" color="regular">
          Large
        </Text>
        <Text
          size="large"
          weight="regular"
          color="regular"
          style={{ marginLeft: 12 }}
        >
          Large
        </Text>
        <Text
          size="large"
          weight="medium"
          color="regular"
          style={{ marginLeft: 12 }}
        >
          Large
        </Text>
        <Text
          size="large"
          weight="semibold"
          color="regular"
          style={{ marginLeft: 12 }}
        >
          Large
        </Text>
        <Text
          size="large"
          weight="bold"
          color="regular"
          style={{ marginLeft: 12 }}
        >
          Large
        </Text>
        <Text
          size="large"
          weight="heavy"
          color="regular"
          style={{ marginLeft: 12 }}
        >
          Large
        </Text>
      </div>
      <div style={{ marginTop: 12 }}>
        <Text size="title" weight="light" color="regular">
          Title
        </Text>
        <Text
          size="title"
          weight="regular"
          color="regular"
          style={{ marginLeft: 12 }}
        >
          Title
        </Text>
        <Text
          size="title"
          weight="medium"
          color="regular"
          style={{ marginLeft: 12 }}
        >
          Title
        </Text>
        <Text
          size="title"
          weight="semibold"
          color="regular"
          style={{ marginLeft: 12 }}
        >
          Title
        </Text>
        <Text
          size="title"
          weight="bold"
          color="regular"
          style={{ marginLeft: 12 }}
        >
          Title
        </Text>
        <Text
          size="title"
          weight="heavy"
          color="regular"
          style={{ marginLeft: 12 }}
        >
          Title
        </Text>
      </div>
    </div>
    <div style={{ marginTop: 40, padding: 16 }}>
      <div>
        <Text size="tiny" weight="light" color="light">
          Tiny
        </Text>
        <Text
          size="tiny"
          weight="regular"
          color="light"
          style={{ marginLeft: 12 }}
        >
          Tiny
        </Text>
        <Text
          size="tiny"
          weight="medium"
          color="light"
          style={{ marginLeft: 12 }}
        >
          Tiny
        </Text>
        <Text
          size="tiny"
          weight="semibold"
          color="light"
          style={{ marginLeft: 12 }}
        >
          Tiny
        </Text>
        <Text
          size="tiny"
          weight="bold"
          color="light"
          style={{ marginLeft: 12 }}
        >
          Tiny
        </Text>
        <Text
          size="tiny"
          weight="heavy"
          color="light"
          style={{ marginLeft: 12 }}
        >
          Tiny
        </Text>
      </div>
      <div style={{ marginTop: 12 }}>
        <Text size="small" weight="light" color="light">
          Small
        </Text>
        <Text
          size="small"
          weight="regular"
          color="light"
          style={{ marginLeft: 12 }}
        >
          Small
        </Text>
        <Text
          size="small"
          weight="medium"
          color="light"
          style={{ marginLeft: 12 }}
        >
          Small
        </Text>
        <Text
          size="small"
          weight="semibold"
          color="light"
          style={{ marginLeft: 12 }}
        >
          Small
        </Text>
        <Text
          size="small"
          weight="bold"
          color="light"
          style={{ marginLeft: 12 }}
        >
          Small
        </Text>
        <Text
          size="small"
          weight="heavy"
          color="light"
          style={{ marginLeft: 12 }}
        >
          Small
        </Text>
      </div>
      <div style={{ marginTop: 12 }}>
        <Text size="regular" weight="light" color="light">
          Regular
        </Text>
        <Text
          size="regular"
          weight="regular"
          color="light"
          style={{ marginLeft: 12 }}
        >
          Regular
        </Text>
        <Text
          size="regular"
          weight="medium"
          color="light"
          style={{ marginLeft: 12 }}
        >
          Regular
        </Text>
        <Text
          size="regular"
          weight="semibold"
          color="light"
          style={{ marginLeft: 12 }}
        >
          Regular
        </Text>
        <Text
          size="regular"
          weight="bold"
          color="light"
          style={{ marginLeft: 12 }}
        >
          Regular
        </Text>
        <Text
          size="regular"
          weight="heavy"
          color="light"
          style={{ marginLeft: 12 }}
        >
          Regular
        </Text>
      </div>
      <div style={{ marginTop: 12 }}>
        <Text size="large" weight="light" color="light">
          Large
        </Text>
        <Text
          size="large"
          weight="regular"
          color="light"
          style={{ marginLeft: 12 }}
        >
          Large
        </Text>
        <Text
          size="large"
          weight="medium"
          color="light"
          style={{ marginLeft: 12 }}
        >
          Large
        </Text>
        <Text
          size="large"
          weight="semibold"
          color="light"
          style={{ marginLeft: 12 }}
        >
          Large
        </Text>
        <Text
          size="large"
          weight="bold"
          color="light"
          style={{ marginLeft: 12 }}
        >
          Large
        </Text>
        <Text
          size="large"
          weight="heavy"
          color="light"
          style={{ marginLeft: 12 }}
        >
          Large
        </Text>
      </div>
      <div style={{ marginTop: 12 }}>
        <Text size="title" weight="light" color="light">
          Title
        </Text>
        <Text
          size="title"
          weight="regular"
          color="light"
          style={{ marginLeft: 12 }}
        >
          Title
        </Text>
        <Text
          size="title"
          weight="medium"
          color="light"
          style={{ marginLeft: 12 }}
        >
          Title
        </Text>
        <Text
          size="title"
          weight="semibold"
          color="light"
          style={{ marginLeft: 12 }}
        >
          Title
        </Text>
        <Text
          size="title"
          weight="bold"
          color="light"
          style={{ marginLeft: 12 }}
        >
          Title
        </Text>
        <Text
          size="title"
          weight="heavy"
          color="light"
          style={{ marginLeft: 12 }}
        >
          Title
        </Text>
      </div>
    </div>
    <div
      style={{
        marginTop: 40,
        borderRadius: 8,
        padding: 16,
        backgroundColor: 'hsl(195 7.1% 11%)',
      }}
    >
      <div>
        <Text size="tiny" weight="light" color="contrast">
          Tiny
        </Text>
        <Text
          size="tiny"
          weight="regular"
          color="contrast"
          style={{ marginLeft: 12 }}
        >
          Tiny
        </Text>
        <Text
          size="tiny"
          weight="medium"
          color="contrast"
          style={{ marginLeft: 12 }}
        >
          Tiny
        </Text>
        <Text
          size="tiny"
          weight="semibold"
          color="contrast"
          style={{ marginLeft: 12 }}
        >
          Tiny
        </Text>
        <Text
          size="tiny"
          weight="bold"
          color="contrast"
          style={{ marginLeft: 12 }}
        >
          Tiny
        </Text>
        <Text
          size="tiny"
          weight="heavy"
          color="contrast"
          style={{ marginLeft: 12 }}
        >
          Tiny
        </Text>
      </div>
      <div style={{ marginTop: 12 }}>
        <Text size="small" weight="light" color="contrast">
          Small
        </Text>
        <Text
          size="small"
          weight="regular"
          color="contrast"
          style={{ marginLeft: 12 }}
        >
          Small
        </Text>
        <Text
          size="small"
          weight="medium"
          color="contrast"
          style={{ marginLeft: 12 }}
        >
          Small
        </Text>
        <Text
          size="small"
          weight="semibold"
          color="contrast"
          style={{ marginLeft: 12 }}
        >
          Small
        </Text>
        <Text
          size="small"
          weight="bold"
          color="contrast"
          style={{ marginLeft: 12 }}
        >
          Small
        </Text>
        <Text
          size="small"
          weight="heavy"
          color="contrast"
          style={{ marginLeft: 12 }}
        >
          Small
        </Text>
      </div>
      <div style={{ marginTop: 12 }}>
        <Text size="regular" weight="light" color="contrast">
          Regular
        </Text>
        <Text
          size="regular"
          weight="regular"
          color="contrast"
          style={{ marginLeft: 12 }}
        >
          Regular
        </Text>
        <Text
          size="regular"
          weight="medium"
          color="contrast"
          style={{ marginLeft: 12 }}
        >
          Regular
        </Text>
        <Text
          size="regular"
          weight="semibold"
          color="contrast"
          style={{ marginLeft: 12 }}
        >
          Regular
        </Text>
        <Text
          size="regular"
          weight="bold"
          color="contrast"
          style={{ marginLeft: 12 }}
        >
          Regular
        </Text>
        <Text
          size="regular"
          weight="heavy"
          color="contrast"
          style={{ marginLeft: 12 }}
        >
          Regular
        </Text>
      </div>
      <div style={{ marginTop: 12 }}>
        <Text size="large" weight="light" color="contrast">
          Large
        </Text>
        <Text
          size="large"
          weight="regular"
          color="contrast"
          style={{ marginLeft: 12 }}
        >
          Large
        </Text>
        <Text
          size="large"
          weight="medium"
          color="contrast"
          style={{ marginLeft: 12 }}
        >
          Large
        </Text>
        <Text
          size="large"
          weight="semibold"
          color="contrast"
          style={{ marginLeft: 12 }}
        >
          Large
        </Text>
        <Text
          size="large"
          weight="bold"
          color="contrast"
          style={{ marginLeft: 12 }}
        >
          Large
        </Text>
        <Text
          size="large"
          weight="heavy"
          color="contrast"
          style={{ marginLeft: 12 }}
        >
          Large
        </Text>
      </div>
      <div style={{ marginTop: 12 }}>
        <Text size="title" weight="light" color="contrast">
          Title
        </Text>
        <Text
          size="title"
          weight="regular"
          color="contrast"
          style={{ marginLeft: 12 }}
        >
          Title
        </Text>
        <Text
          size="title"
          weight="medium"
          color="contrast"
          style={{ marginLeft: 12 }}
        >
          Title
        </Text>
        <Text
          size="title"
          weight="semibold"
          color="contrast"
          style={{ marginLeft: 12 }}
        >
          Title
        </Text>
        <Text
          size="title"
          weight="bold"
          color="contrast"
          style={{ marginLeft: 12 }}
        >
          Title
        </Text>
        <Text
          size="title"
          weight="heavy"
          color="contrast"
          style={{ marginLeft: 12 }}
        >
          Title
        </Text>
      </div>
    </div>
  </div>
);
