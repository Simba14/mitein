import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'gatsby';
import { bool, func, oneOf } from 'prop-types';

import styles from './form.module.scss';

export const SIGN_UP_TYPE = 'signUp';
export const LOGIN_TYPE = 'login';
const LEARNER_TYPE = 'LEARNER';
const NATIVE_TYPE = 'NATIVE';
const REPRESENTATIVE_TYPE = 'REPRESENTATIVE';

const userType = {
  learner: LEARNER_TYPE,
  native: NATIVE_TYPE,
  representative: REPRESENTATIVE_TYPE,
};

const Form = ({ loadingSubmit, onSubmit, type }) => {
  const { t } = useTranslation('form');
  const { register, handleSubmit, errors } = useForm();
  const isSignUp = type === SIGN_UP_TYPE;

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="email">{t('email')}</label>
        <input
          ref={register({ required: true })}
          className={styles.email}
          id="email"
          name="email"
          placeholder="Email"
          type="email"
        />
      </div>
      <div>
        <label htmlFor="password">{t('password')}</label>
        <input
          ref={register({ required: true })}
          className={styles.password}
          id="password"
          name="password"
          placeholder="Password"
          type="password"
        />
      </div>
      {isSignUp && (
        <>
          <div>
            <label htmlFor="confirmPassword">{t('confirmPassword')}</label>
            <input
              ref={register({ required: true })}
              className={styles.password}
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Password"
              type="password"
            />
          </div>
          <div>
            <label htmlFor="accountType">{t('accountType.label')}</label>
            <select
              ref={register({ required: true })}
              className={styles.password}
              id="accountType"
              name="accountType"
            >
              <option value={userType.learner}>
                {t('accountType.learner')}
              </option>
              <option value={userType.native}>{t('accountType.native')}</option>
              <option value={userType.representative}>
                {t('accountType.representative')}
              </option>
            </select>
          </div>
        </>
      )}
      <button
        className={styles.submitButton}
        type="submit"
        disabled={loadingSubmit}
      >
        {t(`${type}.submitBtn`)}
      </button>
      <div>
        {t(`${type}.changeLocation.text`)}{' '}
        <Link to={t(`${type}.changeLocation.route`)}>
          {t(`${type}.changeLocation.cta`)}
        </Link>
      </div>
    </form>
  );
};

Form.propTypes = {
  loadingSubmit: bool,
  onSubmit: func.isRequired,
  type: oneOf([SIGN_UP_TYPE, LOGIN_TYPE]).isRequired,
};

export default Form;
