import React, { useCallback, useEffect } from 'react';
import classnames from 'classnames/bind';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { bool, func, oneOf, string } from 'prop-types';
import { get } from 'lodash/fp';
import { throttle } from 'lodash';

import Anchor from 'components/anchor';
import Cta from 'components/cta';

import styles from './form.module.scss';
const cx = classnames.bind(styles);

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

const Form = ({ submitError, loadingSubmit, onChange, onSubmit, type }) => {
  const { t } = useTranslation('form');
  const { clearErrors, register, handleSubmit, errors, setError } = useForm();
  const isSignUp = type === SIGN_UP_TYPE;

  useEffect(() => {
    if (submitError) {
      setError('submit', {
        type: 'manual',
        message: submitError,
      });
    }
  }, [submitError]);

  const handleOnChange = useCallback(
    throttle(
      () => {
        clearErrors('submit');
        onChange();
      },
      1000,
      { trailing: false },
    ),
    [],
  );

  return (
    <form className={cx('form')} onSubmit={handleSubmit(onSubmit)}>
      <div className={cx('fieldContainer', { hasError: errors.email })}>
        <label htmlFor="email">{t('email')}</label>
        <input
          ref={register({ required: t('error.required'), validate: true })}
          className={cx('email')}
          id="email"
          name="email"
          placeholder={t('email')}
          type="email"
          onChange={handleOnChange}
        />

        <div className={cx('fieldError', { show: errors.email })}>
          {get('email.message', errors)}
        </div>
      </div>
      <div className={cx('fieldContainer', { hasError: errors.password })}>
        <label htmlFor="password">{t('password')}</label>
        <input
          ref={register({ required: t('error.required') })}
          className={cx('password')}
          id="password"
          name="password"
          placeholder={t('password')}
          type="password"
          onChange={handleOnChange}
        />
        <div className={cx('fieldError')}>
          {get('password.message', errors)}
        </div>
      </div>
      {isSignUp && (
        <>
          <div
            className={cx('fieldContainer', {
              hasError: errors.confirmPassword,
            })}
          >
            <label htmlFor="confirmPassword">{t('confirmPassword')}</label>
            <input
              ref={register({ required: t('error.required') })}
              className={cx('password')}
              id="confirmPassword"
              name="confirmPassword"
              placeholder={t('password')}
              type="password"
              onChange={handleOnChange}
            />
            <div className={cx('fieldError')}>
              {get('confirmPassword.message', errors)}
            </div>
          </div>
          <div
            className={cx('fieldContainer', { hasError: errors.displayName })}
          >
            <label htmlFor="displayName">{t('displayName.label')}</label>
            <input
              ref={register({ required: t('error.required') })}
              className={cx('email')}
              id="displayName"
              name="displayName"
              placeholder={t('displayName.placeholder')}
              type="text"
            />
            <div className={cx('fieldError')}>
              {get('displayName.message', errors)}
            </div>
          </div>
          <div className={cx('fieldContainer')}>
            <label htmlFor="accountType">{t('accountType.label')}</label>
            <select
              ref={register({ required: t('error.required') })}
              className={cx('password')}
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
        className={cx('submitButton')}
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
      <div className={cx('error', { visible: errors.submit })}>
        {get('submit.message', errors)}
      </div>
    </form>
  );
};

Form.propTypes = {
  loadingSubmit: bool,
  onChange: func.isRequired,
  onSubmit: func.isRequired,
  submitError: string,
  type: oneOf([SIGN_UP_TYPE, LOGIN_TYPE]).isRequired,
};

export default Form;
