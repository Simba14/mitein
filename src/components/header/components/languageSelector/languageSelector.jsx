import React from 'react';
import { Link } from 'gatsby';
import { usePageContext } from 'context/page';

import styles from './languageSelector.module.scss';

const ENGLISH = 'en';
const GERMAN = 'de';

const LanguageSelector = () => {
  const { lang, originalPath } = usePageContext();

  const Element = ({ language }) =>
    lang === language ? (
      <div className={styles.language}>{language}</div>
    ) : (
      <Link
        aria-label={`Change language to ${language}`}
        to={`/${language}${originalPath}`}
        className={`${styles.language} ${styles.unselected}`}
      >
        {language}
      </Link>
    );

  return (
    <div className={styles.languageSelector}>
      <Element language={ENGLISH} />
      <Element language={GERMAN} />
    </div>
  );
};

export default LanguageSelector;
