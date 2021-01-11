import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { bool, func, oneOf } from 'prop-types';
import { get } from 'lodash/fp';

import styles from './form.module.scss';

import Anchor from 'components/anchor';
import Cta from 'components/cta';

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

const Form = ({ submitError, loadingSubmit, onSubmit, type }) => {
  const { t } = useTranslation('form');
  const { clearErrors, register, handleSubmit, errors, setError } = useForm();
  const isSignUp = type === SIGN_UP_TYPE;

  useEffect(() => {
    if (submitError) {
      const message = get('graphQLErrors[0].message', submitError);
      setError('submit', {
        type: 'manual',
        message,
      });
    }
  }, [submitError]);

  console.log({ errors });
  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div
        className={`${styles.fieldContainer} ${
          errors.email ? styles.hasError : ''
        }`}
      >
        <label htmlFor="email">{t('email')}</label>
        <input
          ref={register({ required: t('error.required'), validate: true })}
          className={styles.email}
          id="email"
          name="email"
          placeholder="Email"
          type="email"
        />

        <div
          className={`${styles.fieldError} ${errors.email ? styles.show : ''}`}
        >
          {errors?.email?.message}
        </div>
      </div>
      <div
        className={`${styles.fieldContainer} ${
          errors.password ? styles.hasError : ''
        }`}
      >
        <label htmlFor="password">{t('password')}</label>
        <input
          ref={register({ required: t('error.required') })}
          className={styles.password}
          id="password"
          name="password"
          placeholder="Password"
          type="password"
          onChange={() => clearErrors('submit')}
        />
        <div className={styles.fieldError}>{errors?.password?.message}</div>
      </div>
      {isSignUp && (
        <>
          <div
            className={`${styles.fieldContainer} ${
              errors.confirmPassword ? styles.hasError : ''
            }`}
          >
            <label htmlFor="confirmPassword">{t('confirmPassword')}</label>
            <input
              ref={register({ required: t('error.required') })}
              className={styles.password}
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Password"
              type="password"
            />
            <div className={styles.fieldError}>
              {errors?.confirmPassword?.message}
            </div>
          </div>
          <div className={styles.fieldContainer}>
            <label htmlFor="accountType">{t('accountType.label')}</label>
            <select
              ref={register({ required: t('error.required') })}
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
      <Cta
        className={styles.submitButton}
        type="submit"
        disabled={loadingSubmit}
        text={t(`${type}.submitBtn`)}
      />
      <div>
        {t(`${type}.changeLocation.text`)}{' '}
        <Anchor to={t(`${type}.changeLocation.route`)}>
          {t(`${type}.changeLocation.cta`)}
        </Anchor>
      </div>
      <div className={`${styles.error} ${errors.submit ? styles.visible : ''}`}>
        {errors.submit?.message}
      </div>
    </form>
  );
};

Form.propTypes = {
  loadingSubmit: bool,
  // onError: func.isRequired,
  onSubmit: func.isRequired,
  type: oneOf([SIGN_UP_TYPE, LOGIN_TYPE]).isRequired,
};

export default Form;
