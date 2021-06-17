import React from 'react';
import { string } from 'prop-types';
import { useRouter } from 'next/router';

import Link from 'components/link';
import { ENGLISH, GERMAN } from 'constants/defaultOptions';
import styles from './languageSelector.module.scss';

const LanguageSelector = () => {
  const { locale, pathname } = useRouter();

  const Element = ({ language }) =>
    locale === language ? (
      <div className={styles.language}>{language}</div>
    ) : (
      <Link
        aria-label={`Change language to ${language}`}
        to={pathname}
        locale={language}
        className={`${styles.language} ${styles.unselected}`}
      >
        {language}
      </Link>
    );

  Element.propTypes = { language: string };

  return (
    <div className={styles.languageSelector}>
      <Element language={ENGLISH} />
      <Element language={GERMAN} />
    </div>
  );
};

export default LanguageSelector;
