import React, { useEffect, useState } from 'react';
import { arrayOf, any, shape, string } from 'prop-types';
import { get, uniq, flatMap, intersection } from 'lodash';
import { useTranslation } from 'next-i18next';
import classnames from 'classnames/bind';

import ContactUs from 'components/blocks/contactUs';
import NewsletterBanner from 'components/blocks/newsletter';
import OrganizationCard from 'components/blocks/organizationCard';
import { withLayout } from 'components/blocks/layout';

import styles from './volunteer.module.scss';
import Text, { BODY_3, HEADING_2, HEADING_5 } from 'components/atoms/text';
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
      <Text className={cx('headline')} tag="h1" type={HEADING_2}>
        {t('headline')}
      </Text>
      <Text className={cx('subheadline')} tag="h2" type={HEADING_5}>
        {t('subheadline')}
      </Text>
      <div className={cx('filters')}>
        <Text className={cx('filterTitle')} type={BODY_3}>
          {t('filterBy')}
        </Text>
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
      {firstResult ? (
        <div className={cx('organizations')}>
          {results.map((organization, index) => (
            <OrganizationCard
              key={`organization${index}${firstResult}`}
              loading={false}
              organization={organization}
              t={t}
            />
          ))}
        </div>
      ) : (
        <Text className={cx('noResults')}>
          No Opportunities at the moment. Check back here soon!
        </Text>
      )}
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
