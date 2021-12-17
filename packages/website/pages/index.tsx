import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { Toolbar, Button, Separator } from '@minddrop/ui';
import { Image, ImageSvg, ThemeToggle, EmailForm } from '../components';
import styles from '../styles/Home.module.css';

const Checkmark: React.FC = () => (
  <ImageSvg
    srcLight="/checkmark-light.svg"
    srcDark="/checkmark-dark.svg"
    className={styles.pricingCardFeatureIcon}
  />
);

const Heart: React.FC = () => (
  <ImageSvg
    srcLight="/heart-light.svg"
    srcDark="/heart-dark.svg"
    className={styles.pricingCardFeatureIcon}
  />
);

const Home: NextPage = () => {
  return (
    <div className={`${styles.container}`}>
      <Head>
        <title>MindDrop</title>
        <meta name="description" content="Your mind's visual workspace." />
        <link rel="icon" href="/favicon.png" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>

      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <img src="/logo.svg" alt="MindDrop logo" className={styles.logo} />
          <h1 className={styles.minddrop}>MindDrop</h1>
        </div>
        <div>
          <Toolbar>
            <Button variant="text" href="#pricing">
              Pricing
            </Button>
            <Button variant="text" href="https://docs.minddrop.app">
              Docs
            </Button>
            <span />
            <ThemeToggle />
          </Toolbar>
        </div>
      </div>
      <main className={styles.main}>
        <div className={styles.heading}>
          <h2 className={styles.title}>Your mind's visual workspace.</h2>
          <h3 className={styles.subtitle}>
            Organize your projects, studies, research, and ideas into a visual
            workspace.
          </h3>
          <p className={styles.subtext}>
            MindDrop is{' '}
            <a href="https://github.com/coniel/minddrop">open source</a> and
            free for unlimited offline use.
          </p>
          <EmailForm />
        </div>
        {/* <div className={styles.carouselControls}>
          <Button variant="text" className={styles.textButton}>
            Plan
          </Button>
          <Button variant="text" className={styles.textButton}>
            Learn
          </Button>
          <Button variant="text" className={styles.textButton}>
            Research
          </Button>
          <Button variant="text" className={styles.textButton}>
            Collect
          </Button>
        </div> */}
        <div className={styles.screenshot}>
          <Image
            srcLight="/screenshot-light.png"
            srcDark="/screenshot-dark.png"
            width={2984}
            height={1904}
          />
        </div>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Drop it in.</h3>
          <p className={styles.sectionSubtitle}>
            Drops are the content of MindDrop. There are all kinds of drops for
            different purposes, from static content to interactive tools.
          </p>
          <div className={styles.drops}>
            <Image
              srcLight="/drops-light.png"
              srcDark="/drops-dark.png"
              width={2066}
              height={1597}
            />
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Keep it organised.</h3>
          <p className={styles.sectionSubtitle}>
            Organise by topic and ceate a network of connected concepts.
          </p>
          <div className={styles.organizationFeatures}>
            <div className={styles.organizationFeature}>
              <h4 className={styles.organizationFeatureTitle}>Topics</h4>
              <div className={styles.organizationFeatureImage}>
                <Image
                  srcLight="/topics-light.png"
                  srcDark="/topics-dark.png"
                  width={500}
                  height={200}
                />
              </div>
              <p className={styles.organizationFeatureText}>
                Group content by topic. Topics can be nested for a hierarchical
                structure.
              </p>
            </div>
            <div className={styles.organizationFeature}>
              <h4 className={styles.organizationFeatureTitle}>Tags</h4>
              <div className={styles.organizationFeatureImage}>
                <Image
                  srcLight="/tags-light.png"
                  srcDark="/tags-dark.png"
                  width={500}
                  height={200}
                />
                <div
                  className={styles.organizationFeatureImageCutoff}
                  style={{ marginTop: -3 }}
                />
              </div>
              <p className={styles.organizationFeatureText}>
                Tag drops and topics to easily filter by content type.
              </p>
            </div>
            <div className={styles.organizationFeature}>
              <h4 className={styles.organizationFeatureTitle}>Links</h4>
              <div className={styles.organizationFeatureImage}>
                <div className={styles.organizationFeatureImageCutoff} />
                <Image
                  srcLight="/links-light.png"
                  srcDark="/links-dark.png"
                  width={500}
                  height={200}
                />
              </div>
              <p className={styles.organizationFeatureText}>
                Linking between drops is a powerful way to build a network of
                related information.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Built right.</h3>
          <div className={styles.featureList}>
            <div className={styles.feature}>
              <ImageSvg
                srcLight="/local-light.svg"
                srcDark="/local-dark.svg"
                className={styles.featureImage}
              />
              <h4 className={styles.featureTitle}>Local</h4>
              <p className={styles.featureText}>
                MindDrop <strong>stores all of your data locally</strong>.
                You’re not locked in to any cloud and the app works offline.
              </p>
            </div>

            <div className={styles.feature}>
              <ImageSvg
                srcLight="/private-light.svg"
                srcDark="/private-dark.svg"
                className={styles.featureImage}
              />
              <h4 className={styles.featureTitle}>Private</h4>
              <p className={styles.featureText}>
                Your data is yours. We don’t have access to any of your content
                and <strong>don’t collect any data from you</strong>.
              </p>
            </div>

            <div className={styles.feature}>
              <ImageSvg
                srcLight="/open-light.svg"
                srcDark="/open-dark.svg"
                className={styles.featureImage}
              />
              <h4 className={styles.featureTitle}>Open</h4>
              <p className={styles.featureText}>
                MindDrop is 100%{' '}
                <strong>
                  <a href="https://github.com/coniel/minddrop">open source</a>
                </strong>{' '}
                and free to use offline. You don’t even need to create an
                account to use it.
              </p>
            </div>
          </div>
          <div className={styles.featureList}>
            <div className={styles.feature}>
              <ImageSvg
                srcLight="/personal-light.svg"
                srcDark="/personal-dark.svg"
                className={styles.featureImage}
              />
              <h4 className={styles.featureTitle}>Personal</h4>
              <p className={styles.featureText}>
                MindDrop is <strong>made for individuals</strong>. It’s not
                bloated with features just for teams and corporations.
              </p>
            </div>

            <div className={styles.feature}>
              <ImageSvg
                srcLight="/bootstrapped-light.svg"
                srcDark="/bootstrapped-dark.svg"
                className={styles.featureImage}
              />
              <h4 className={styles.featureTitle}>Bootstrapped</h4>
              <p className={styles.featureText}>
                We built MindDrop for ourselves. We’re is{' '}
                <strong>100% self funded</strong>, no profit pushing investors
                here.
              </p>
            </div>

            <div className={styles.feature}>
              <ImageSvg
                srcLight="/communal-light.svg"
                srcDark="/communal-dark.svg"
                className={styles.featureImage}
              />
              <h4 className={styles.featureTitle}>Communal</h4>
              <p className={styles.featureText}>
                MindDrop’s community is here to help.{' '}
                <strong>
                  <a href="https://community.minddrop.app">Join the forums</a>
                </strong>{' '}
                to get support, or just to hang out.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3 id="pricing" className={styles.sectionTitle}>
            Simple pricing
          </h3>
          <div className={styles.pricingCards}>
            <div className={styles.pricingCard}>
              <h4 className={styles.pricingCardTitle}>Use</h4>
              <div className={styles.pricingCardPrice}>
                <span className={styles.pricingCardPriceNumber}>$0</span>
                <span className={styles.pricingCardPricePeriod}>/ month</span>
              </div>
              <ul className={styles.pricingCardFeatureList}>
                <li className={styles.pricingCardFeature}>
                  <Checkmark />
                  Offline local storage
                </li>
                <li className={styles.pricingCardFeature}>
                  <Checkmark />
                  Unlimited content
                </li>
                <li className={styles.pricingCardFeature}>
                  <Checkmark />
                  No account or sign up required
                </li>
                <li className={styles.pricingCardFeature}>
                  <Checkmark />
                  Access to extensions
                </li>
                <li className={styles.pricingCardFeature}>
                  <Checkmark />
                  Community support
                </li>
              </ul>
              <div className={styles.pricingCardComingSoon}>coming soon</div>
              {/* <Button fullWidth variant="primary">
                Notify me
              </Button> */}
            </div>

            <div className={styles.pricingCard}>
              <h4 className={styles.pricingCardTitle}>Sync</h4>
              <div className={styles.pricingCardPrice}>
                <span className={styles.pricingCardPriceNumber}>$5</span>
                <span className={styles.pricingCardPricePeriod}>/ month</span>
              </div>
              <ul className={styles.pricingCardFeatureList}>
                <li className={styles.pricingCardFeature}>
                  <Checkmark />
                  Sync accross devices
                </li>
                <li className={styles.pricingCardFeature}>
                  <Checkmark />
                  End-to-end encryption
                </li>
                <li className={styles.pricingCardFeature}>
                  <Checkmark />
                  Cloud data backup (10GB)
                </li>
                <li className={styles.pricingCardFeature}>
                  <Checkmark />
                  Email support
                </li>
                <li className={styles.pricingCardFeature}>
                  <Heart />
                  Support the developer
                </li>
              </ul>
              <div className={styles.pricingCardComingSoon}>coming soon</div>
              {/* <Button fullWidth variant="primary">
                Notify me
              </Button> */}
            </div>

            <div className={styles.pricingCard}>
              <h4 className={styles.pricingCardTitle}>Publish</h4>
              <div className={styles.pricingCardPrice}>
                <span className={styles.pricingCardPriceNumber}>$9</span>
                <span className={styles.pricingCardPricePeriod}>/ month</span>
              </div>
              <ul className={styles.pricingCardFeatureList}>
                <li className={styles.pricingCardFeature}>
                  <Checkmark />
                  Publish topics as a website web
                </li>
                <li className={styles.pricingCardFeature}>
                  <Checkmark />
                  No technical knowledge required
                </li>
                <li className={styles.pricingCardFeature}>
                  <Checkmark />
                  Selectively publish topics
                </li>
                <li className={styles.pricingCardFeature}>
                  <Checkmark />
                  Email support
                </li>
                <li className={styles.pricingCardFeature}>
                  <Heart />
                  Support the developer
                </li>
              </ul>
              <div className={styles.pricingCardComingSoon}>coming soon</div>
              {/* <Button fullWidth variant="primary">
                Notify me
              </Button> */}
            </div>
          </div>

          <p className={styles.pricingText}>
            MindDrop Sync and Publish are add-on services. The MindDrop app does
            not require them nor an account to work.
          </p>
        </div>
        <EmailForm />
      </main>
      {/* 
      <footer className={styles.footer}>
        <Separator margin="large" />
        Footer
      </footer> */}
    </div>
  );
};

export default Home;
