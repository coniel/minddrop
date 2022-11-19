import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { Toolbar, Button } from '@minddrop/ui';
import { Image, ImageSvg, ThemeToggle, EmailForm } from '../components';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  return (
    <div className={`${styles.container}`}>
      <Head>
        <title>MindDrop</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Organize your projects, studies, research, and ideas into a visual workspace."
        />
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
            <Button
              variant="text"
              href="https://docs.minddrop.app"
              className={styles.hiddenMobile}
            >
              Docs
            </Button>
            <Button
              variant="text"
              href="https://github.com/coniel/minddrop"
              className={styles.hiddenMobile}
            >
              Github
            </Button>
            <span />
            <ThemeToggle />
          </Toolbar>
        </div>
      </div>
      <main className={styles.main}>
        <div className={styles.heading}>
          <h2 className={styles.title}>Your mind&apos;s visual workspace.</h2>
          <h3 className={styles.subtitle}>
            Organize your projects, studies, research, and ideas into a visual
            workspace.
          </h3>
          <p className={styles.subtext}>
            MindDrop is free and{' '}
            <a href="https://github.com/coniel/minddrop">open source</a>.
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
          <h3 className={styles.sectionTitle}>Made to be extended.</h3>
          <p className={styles.sectionSubtitle}>
            MindDrop was built from the ground up to be highly extensible with a
            simple yet powerful{' '}
            <a href="https://docs.minddrop.app">extensions API</a>.
          </p>
          <div className={styles.extensionImage}>
            <Image
              srcLight="/extension-light.png"
              srcDark="/extension-dark.png"
              width={1654}
              height={1160}
            />
          </div>
        </div>

        <div className={styles.section}>
          <EmailForm />
        </div>
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
