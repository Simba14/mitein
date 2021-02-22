import React, { useEffect, useState } from 'react';
import { get, uniq, flatMap, intersection } from 'lodash';
import { useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';

import NewsletterBanner from 'components/newsletter';
import OrganizationCard from 'components/organizationCard';
import { withLayout } from 'components/layout';
import GET_VOLUNTEERING_OPPS from 'graphql/queries/getVolunteeringOpps.graphql';

import styles from './volunteer.module.scss';

const Volunteer = () => {
  const [filterOptions, setFilterOptions] = useState(null);
  const [filters, setFilters] = useState([]);
  const [results, setResults] = useState([...Array(3)]);
  const {
    i18n: { language },
    t,
  } = useTranslation('volunteer');

  const { data, loading, ...rest } = useQuery(GET_VOLUNTEERING_OPPS, {
    variables: { city: 'Berlin', locale: language },
  });
  console.log({ data, loading, ...rest, query: GET_VOLUNTEERING_OPPS });
  const volunteerWith = get(data, 'volunteerWith');

  useEffect(() => {
    if (volunteerWith) {
      const uniqueTags = uniq(flatMap(volunteerWith, (org) => org.tags || []));

      setResults(volunteerWith);
      setFilterOptions(uniqueTags);
    }
  }, [volunteerWith]);

  useEffect(() => {
    if (!loading) {
      const newResults = filters.length
        ? results.filter((result) => intersection(result.tags, filters).length)
        : volunteerWith;

      setResults(newResults);
    }
  }, [filters]);

  const handleFilterClick = (option) => {
    setFilters((arr) => {
      const alreadySelected = filters.includes(option);
      return alreadySelected
        ? arr.filter((value) => value !== option)
        : [...arr, option];
    });
  };

  const firstResult = get(results[0], 'name');

  return (
    <div className={styles.container}>
      <h1 className={styles.headline}>{t('headline')}</h1>
      <h2 className={styles.subheadline}>{t('subheadline')}</h2>
      <div className={styles.filters}>
        <div className={styles.filterTitle}>{t('filterBy')}</div>
        {filterOptions &&
          filterOptions.map((filter) => (
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
      <div className={styles.organizations}>
        {loading || firstResult ? (
          results.map((organization, index) => (
            <OrganizationCard
              key={`organization${index}${firstResult}`}
              loading={loading}
              organization={organization}
              t={t}
            />
          ))
        ) : (
          <div className={styles.noResults}>
            No Opportunities at the moment. Check back here soon!
          </div>
        )}
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
