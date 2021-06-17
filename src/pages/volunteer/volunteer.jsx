import React, { useEffect, useState } from 'react';
import { arrayOf, any, shape, string } from 'prop-types';
import { get, uniq, flatMap, intersection } from 'lodash';
import { useTranslation } from 'next-i18next';

import ContactUs from 'components/contactUs';
import NewsletterBanner from 'components/newsletter';
import OrganizationCard from 'components/organizationCard';
import { withLayout } from 'components/layout';

import styles from './volunteer.module.scss';

const Volunteer = ({ organizations }) => {
  const [filterOptions, setFilterOptions] = useState(null);
  const [filters, setFilters] = useState([]);
  const [results, setResults] = useState([...Array(3)]);

  const { t } = useTranslation('volunteer');

  useEffect(() => {
    if (organizations) {
      const uniqueTags = uniq(flatMap(organizations, (org) => org.tags || []));

      setResults(organizations);
      setFilterOptions(uniqueTags);
    }
  }, [organizations]);

  useEffect(() => {
    if (organizations) {
      const newResults = filters.length
        ? results.filter((result) => intersection(result.tags, filters).length)
        : organizations;

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
        {firstResult ? (
          results.map((organization, index) => (
            <OrganizationCard
              key={`organization${index}${firstResult}`}
              loading={false}
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
      <ContactUs translation="volunteer" />
    </div>
  );
};

Volunteer.propTypes = {
  organizations: arrayOf(
    shape({
      name: string,
      city: string,
      logo: string,
      socials: any,
      tags: arrayOf(string),
      website: string,
    }),
  ),
};

export default withLayout(Volunteer);
