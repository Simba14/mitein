import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import './languageSelector.scss';

const ENGLISH = 'en';
const GERMAN = 'de';

const LanguageSelector = () => {
  const [indexSelected, toggleSelection] = useState(0);
  const { i18n } = useTranslation();

  const selectLanguage = (index, language) => {
    toggleSelection(index);
    i18n.changeLanguage(language);
  };

  return (
    <div className="languageSelector">
      <button
        className="languageBtn"
        disabled={indexSelected === 0}
        onClick={() => selectLanguage(0, ENGLISH)}
      >
        EN
      </button>
      <button
        className="languageBtn"
        disabled={indexSelected === 1}
        onClick={() => selectLanguage(1, GERMAN)}
      >
        DE
      </button>
    </div>
  );
};

export default LanguageSelector;
