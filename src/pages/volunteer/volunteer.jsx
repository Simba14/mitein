import React, { useEffect, useState } from 'react';
import { arrayOf, any, shape, string } from 'prop-types';
import { get, uniq, flatMap, intersection } from 'lodash';
import { useTranslation } from 'next-i18next';
import classnames from 'classnames/bind';

import ContactUs from 'components/contactUs';
import NewsletterBanner from 'components/newsletter';
import OrganizationCard from 'components/organizationCard';
import { withLayout } from 'components/layout';

import styles from './volunteer.module.scss';
const cx = classnames.bind(styles);

const Volunteer = ({ organizations }) => {
  const [filterOptions, setFilterOptions] = useState(null);
  const [filters, setFilters] = useState([]);
  const [results, setResults] = useState([...Array(3)]);

  const { t } = useTranslation('volunteer');

  useEffect(() => {
    if (organizations) {
      const uniqueTags = uniq(flatMap(organizations, org => org.tags || []));

      setResults(organizations);
      setFilterOptions(uniqueTags);
    }
  }, [organizations]);

  useEffect(() => {
    if (organizations) {
      const newResults = filters.length
        ? results.filter(result => intersection(result.tags, filters).length)
        : organizations;

      setResults(newResults);
    }
  }, [filters]);

  const handleFilterClick = option => {
    setFilters(arr => {
      const alreadySelected = filters.includes(option);
      return alreadySelected
        ? arr.filter(value => value !== option)
        : [...arr, option];
    });
  };

  const firstResult = get(results[0], 'name');

  return (
    <div className={cx('container')}>
      <h1 className={cx('headline')}>{t('headline')}</h1>
      <h2 className={cx('subheadline')}>{t('subheadline')}</h2>
      <div className={cx('filters')}>
        <div className={cx('filterTitle')}>{t('filterBy')}</div>
        {filterOptions &&
          filterOptions.map(filter => (
            <button
              key={filter}
              className={cx('filterBtn', {
                selected: filters.includes(filter),
              })}
              onClick={() => handleFilterClick(filter)}
            >
              {filter}
            </button>
          ))}
      </div>
      <div className={cx('organizations')}>
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
          <div className={cx('noResults')}>
            No Opportunities at the moment. Check back here soon!
          </div>
        )}
      </div>
      <NewsletterBanner className={cx('newsletterBanner')} />
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
