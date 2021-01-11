import React, { useEffect, useState } from 'react';
import { get, map, uniq, flatMap, intersection } from 'lodash';
import { useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';

import NewsletterBanner from 'components/newsletter';
import Svg from 'components/svg';
import { withLayout } from 'components/layout';
import GET_VOLUNTEERING_OPPS from 'graphql/queries/getVolunteeringOpps.graphql';

import styles from './volunteer.module.scss';

const TYPENAME = '__typename';

const Volunteer = () => {
  const [filterOptions, setFilterOptions] = useState(null);
  const [filters, setFilters] = useState([]);
  const [results, setResults] = useState([]);
  const {
    i18n: { language },
    t,
  } = useTranslation('volunteer');
  const { data, error, loading } = useQuery(GET_VOLUNTEERING_OPPS, {
    variables: { city: 'Berlin', locale: language },
  });

  const volunteerWith = get(data, 'volunteerWith');
  useEffect(() => {
    if (volunteerWith) {
      const uniqueTags = uniq(flatMap(volunteerWith, (org) => org.tags || []));

      setResults(volunteerWith);
      setFilterOptions(uniqueTags);
    }
  }, [volunteerWith]);

  useEffect(() => {
    const newResults = filters.length
      ? results.filter((result) => intersection(result.tags, filters).length)
      : volunteerWith;

    setResults(newResults);
  }, [filters]);

  const handleFilterClick = (option) => {
    setFilters((arr) => {
      const alreadySelected = filters.includes(option);
      return alreadySelected
        ? arr.filter((value) => value !== option)
        : [...arr, option];
    });
  };

  if (error || loading || !results) return null;
  // <img className={styles.logo} src={organization.logo} />
  return (
    <div className={styles.container}>
      <h1 className={styles.headline}>{t('headline')}</h1>
      <h2 className={styles.subheadline}>{t('subheadline')}</h2>
      {filterOptions && (
        <div className={styles.filters}>
          <div className={styles.filterTitle}>{t('filterBy')}</div>
          {filterOptions.map((filter) => (
            <button
              key={filter}
              className={`${styles.filterBtn} ${
                filters.includes(filter) ? styles.selected : ''
              }`}
              onClick={() => handleFilterClick(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      )}
      <div className={styles.organizations}>
        {results.map((organization) => (
          <div className={styles.organization} key={organization.name}>
            <div className={styles.info}>
              <div
                className={styles.logo}
                style={{ backgroundImage: `url(${organization.logo})` }}
                role="img"
                aria-label={`logo - ${organization.name}`}
              />
              <div className={styles.name}>{organization.name}</div>
              <div className={styles.description}>
                {organization.description}
              </div>
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
            <a className={styles.website} href={organization.website}>
              {t('learnMore')}
            </a>
          </div>
        ))}
      </div>
      <NewsletterBanner />
      <div className={styles.reachOut}>
        {t('haveOpps')}
        <br />
        {t('contactUs')}
        <a href={`mailto: ${t('email')}`}>{t('email')}</a>
      </div>
    </div>
  );
};

export default withLayout(Volunteer);
