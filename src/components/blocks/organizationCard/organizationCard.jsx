import React from 'react';
import { arrayOf, any, bool, shape, func, string } from 'prop-types';
import { map } from 'lodash';
import classnames from 'classnames/bind';

import Svg from 'components/atoms/svg';
import Text, { BODY_6, HEADING_5 } from 'components/atoms/text';
import styles from './organizationCard.module.scss';

const cx = classnames.bind(styles);
const TYPENAME = '__typename';

const OrganizationCard = ({ loading, organization, t }) => {
  return (
    <li className={cx('organization')}>
      <div className={cx('info', { loading })}>
        <div
          className={cx('logo')}
          style={{ backgroundImage: `url(${organization.logo})` }}
          role="img"
          aria-label={`logo - ${organization.name || 'loading'}`}
        />
        <Text className={cx('name')} tag="h4" type={HEADING_5} bold>
          {organization.name}
        </Text>
        <Text className={cx('description')} type={BODY_6}>
          {organization.description}
        </Text>
        <ul className={cx('tags')}>
          <li className={cx('tag')}>
            <Text type={BODY_6}>{organization.city}</Text>
          </li>
          {organization.tags &&
            organization.tags.map(tag => (
              <li key={`tag: ${tag}`} className={cx('tag')}>
                <Text type={BODY_6}>{tag}</Text>
              </li>
            ))}
        </ul>
        {organization.socials &&
          map(organization.socials, (value, key) =>
            key !== TYPENAME ? (
              <a
                className={cx('socialLink')}
                key={`${organization.name} ${key}`}
                href={value}
                target="_blank"
                rel="noreferrer"
              >
                <Svg className={cx('socialIcon')} name={key} />
              </a>
            ) : null,
          )}
      </div>
      {organization.website && (
        <a
          className={cx('website')}
          href={organization.website}
          target="_blank"
          rel="noreferrer"
        >
          {t('learnMore')}
        </a>
      )}
    </li>
  );
};

OrganizationCard.defaultProps = {
  loading: false,
  organization: {
    name: null,
    city: null,
    description: null,
    logo: null,
    website: null,
    socials: null,
    tags: null,
  },
};

OrganizationCard.propTypes = {
  loading: bool,
  organization: shape({
    name: string,
    description: string,
    city: string,
    logo: string,
    socials: any,
    tags: arrayOf(string),
    website: string,
  }),
  t: func.isRequired,
};

export default OrganizationCard;
