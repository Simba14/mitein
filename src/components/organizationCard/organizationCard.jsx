import React from 'react';
import { arrayOf, any, bool, shape, func, string } from 'prop-types';
import { map } from 'lodash';

import Svg from 'components/svg';
import styles from './organizationCard.module.scss';

const TYPENAME = '__typename';

const OrganizationCard = ({ loading, organization, t }) => {
  console.log({ organization });
  return (
    <div className={styles.organization}>
      <div className={`${styles.info}, ${loading ? styles.loading : ''}`}>
        <div
          className={styles.logo}
          style={{ backgroundImage: `url(${organization.logo})` }}
          role="img"
          aria-label={`logo - ${organization.name}`}
        />
        <div className={styles.name}>{organization.name}</div>
        <div className={styles.description}>{organization.description}</div>
        <div className={styles.tags}>
          <div className={styles.tag}>{organization.city}</div>
          {organization.tags &&
            organization.tags.map((tag) => (
              <div key={`tag: ${tag}`} className={styles.tag}>
                {tag}
              </div>
            ))}
        </div>
        {organization.socials &&
          map(organization.socials, (value, key) =>
            value && key !== TYPENAME ? (
              <a
                className={styles.socialLink}
                key={`${organization.name} ${key}`}
                href={value}
                target="_blank"
                rel="noreferrer"
              >
                <Svg className={styles.socialIcon} name={key} />
              </a>
            ) : null,
          )}
      </div>
      {organization.website && (
        <a className={styles.website} href={organization.website}>
          {t('learnMore')}
        </a>
      )}
    </div>
  );
};

OrganizationCard.defaultProps = {
  loading: false,
  organization: {
    name: null,
    city: null,
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
    city: string,
    logo: string,
    socials: any,
    tags: arrayOf(string),
    website: string,
  }),
  t: func.isRequired,
};

export default OrganizationCard;
