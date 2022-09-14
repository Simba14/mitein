import React from 'react';
import { useTranslation } from 'next-i18next';
import classnames from 'classnames/bind';
import { useQuery } from '@apollo/client';
import { get } from 'lodash/fp';

import Cta from 'components/atoms/cta';
import ContentSection from 'components/blocks/contentSection';
import Layout from 'components/blocks/layout';
import { LoadingLogo } from 'components/atoms/loading';
import Text, { BODY_4 } from 'components/atoms/text';
import { ROUTE_PROFILE } from 'routes';
import { sessionProps, withSessionContext } from 'context/session';
import GET_USER_TYPE from '@graphql/queries/getUserType.graphql';
import getUserSteps from 'helpers/getUserSteps';

import styles from './onboarding.module.scss';
import TextBanner from 'components/atoms/textBanner';
const cx = classnames.bind(styles);

const Onboarding = ({ session }) => {
  const userId = get('userId', session);
  const { data, loading, error } = useQuery(GET_USER_TYPE, {
    variables: { id: userId },
    skip: !userId,
  });
  const { t } = useTranslation('onboarding');

  if (error) return null;
  const userType = get('user.type', data);
  const userSteps = getUserSteps(userType);

  return (
    <Layout>
      {loading || !data ? (
        <LoadingLogo />
      ) : (
        <div className={cx('wrapper')}>
          <div id={'intro'} className={cx('intro')}>
            <TextBanner className={cx('title')}>
              {t(`${userType}.intro.title`)}
            </TextBanner>
            <Text type={BODY_4}>{t(`${userType}.intro.description`)}</Text>
          </div>
          {userSteps.map(({ name, content, className, svg, title }, index) => {
            const Icon = svg;
            return (
              <ContentSection
                key={name}
                anchorId={name}
                className={cx('section')}
                containerClassName={cx('step', className)}
                content={t(content)}
                title={t(title)}
              >
                <Icon className={cx('sectionImage', `step${index}Image`)} />
              </ContentSection>
            );
          })}
          <Cta
            className={cx('continue')}
            text={t(`${userType}.cta`)}
            to={ROUTE_PROFILE}
            fullWidth
          />
        </div>
      )}
    </Layout>
  );
};

Onboarding.propTypes = {
  session: sessionProps,
};

export default withSessionContext(Onboarding);
