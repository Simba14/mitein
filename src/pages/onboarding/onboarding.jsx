import React from 'react';
import { useTranslation } from 'next-i18next';
import classnames from 'classnames/bind';
import { useQuery } from '@apollo/client';
import { get } from 'lodash/fp';

import Cta from 'components/cta';
import ContentSection from 'components/contentSection';
import Layout from 'components/layout';
import Loading from 'components/loading';
import { ROUTE_PROFILE } from 'routes';
import { sessionProps, withSessionContext } from 'context/session';
import GET_USER_TYPE from '@graphql/queries/getUserType.graphql';
import getUserSteps from 'helpers/getUserSteps';

import styles from './onboarding.module.scss';
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
        <Loading />
      ) : (
        <div className={cx('wrapper')}>
          <div id={'intro'} className={cx('intro')}>
            <h1 className={cx('title')}>{t(`${userType}.intro.title`)}</h1>
            <div>{t(`${userType}.intro.description`)}</div>
          </div>
          {userSteps.map(({ name, content, className, svg, title }) => {
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
                <Icon className={cx('sectionImage')} />
              </ContentSection>
            );
          })}
          <ContentSection
            className={cx('section')}
            containerClassName={cx('step')}
          >
            <Cta
              className={cx('continue')}
              text={t(`${userType}.cta`)}
              to={ROUTE_PROFILE}
            />
          </ContentSection>
        </div>
      )}
    </Layout>
  );
};

Onboarding.propTypes = {
  session: sessionProps,
};

export default withSessionContext(Onboarding);
