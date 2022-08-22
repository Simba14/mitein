import React, { useCallback, useEffect } from 'react';
import classnames from 'classnames/bind';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { bool, func, oneOf, shape, string } from 'prop-types';
import { get } from 'lodash/fp';
import { throttle } from 'lodash';

import Anchor from 'components/atoms/anchor';
import Cta from 'components/atoms/cta';
import { ROUTE_FORGOT_PASSWORD, ROUTE_LOGIN, ROUTE_SIGN_UP } from 'routes';
import { USER_TYPE_LEARNER, USER_TYPE_NATIVE } from '@api/firebase/constants';

import styles from './form.module.scss';
const cx = classnames.bind(styles);

export const SIGN_UP_TYPE = 'signUp';
export const LOGIN_TYPE = 'login';
export const FORGOT_PASSWORD = 'forgotPassword';
export const RESET_PASSWORD = 'resetPassword';

const EmailInput = ({ errors, registerInput, t }) => (
  <div className={cx('fieldContainer', { hasError: errors?.email })}>
    <label htmlFor="email">{t('email')}</label>
    <input
      {...registerInput('email')}
      className={cx('textInput')}
      id="email"
      placeholder={t('email')}
      type="email"
    />

    <div className={cx('fieldError')}>{get('email.message', errors)}</div>
  </div>
);

EmailInput.propTypes = {
  errors: shape({
    email: shape({
      message: string,
    }),
  }),
  registerInput: func,
  t: func,
};

const Form = ({
  displaySuccessMsg,
  submitError,
  loadingSubmit,
  onChange,
  onSubmit,
  type,
}) => {
  const { t } = useTranslation(['form', 'errors']);
  const {
    clearErrors,
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setError,
    setFocus,
  } = useForm();
  const isSignUp = type === SIGN_UP_TYPE;
  const isLogin = type === LOGIN_TYPE;
  const isForgotPassword = type === FORGOT_PASSWORD;
  const isResetPassword = type === RESET_PASSWORD;

  useEffect(() => {
    setFocus(isResetPassword ? 'password' : 'email');
  }, [setFocus]);

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
      event => {
        clearErrors('submit');
        onChange();
        event.persist();
      },
      1000,
      { trailing: false },
    ),
    [onChange, clearErrors],
  );

  const registerInput = (name, validation) => {
    const { onChange, ...rest } = register(name, {
      required: t('errorMsg.required'),
      ...validation,
    });
    return {
      ...rest,
      onChange: e => {
        onChange(e);
        handleOnChange(e);
      },
    };
  };

  return (
    <form className={cx('form')} onSubmit={handleSubmit(onSubmit)}>
      {!isResetPassword && (
        <EmailInput errors={errors} registerInput={registerInput} t={t} />
      )}
      {!isForgotPassword && (
        <div className={cx('fieldContainer', { hasError: errors?.password })}>
          <label htmlFor="password">{t('password')}</label>
          <input
            {...registerInput('password')}
            className={cx('password')}
            id="password"
            placeholder={t('password')}
            type="password"
          />
          <div className={cx('fieldError')}>
            {get('password.message', errors)}
          </div>
        </div>
      )}
      {(isSignUp || isResetPassword) && (
        <div
          className={cx('fieldContainer', {
            hasError: errors?.confirmPassword,
          })}
        >
          <label htmlFor="confirmPassword">{t('confirmPassword')}</label>
          <input
            {...registerInput('confirmPassword', {
              validate: {
                passwordsMatch: v =>
                  getValues().password === v || t('confirmPasswordError'),
              },
            })}
            className={cx('password')}
            id="confirmPassword"
            placeholder={t('password')}
            type="password"
          />
          <div className={cx('fieldError')}>
            {get('confirmPassword.message', errors)}
          </div>
        </div>
      )}
      {isSignUp && (
        <>
          <div
            className={cx('fieldContainer', { hasError: errors?.displayName })}
          >
            <label htmlFor="displayName">{t('displayName.label')}</label>
            <input
              {...registerInput('displayName', {
                validate: {
                  oneWord: name =>
                    name.trim().split(' ').length === 1 ||
                    t('displayName.error'),
                },
              })}
              className={cx('textInput')}
              id="displayName"
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
              {...register('accountType')}
              className={cx('dropdown')}
              id="accountType"
            >
              <option value={USER_TYPE_LEARNER}>
                {t('accountType.learner')}
              </option>
              <option value={USER_TYPE_NATIVE}>
                {t('accountType.native')}
              </option>
            </select>
          </div>
        </>
      )}
      <Cta
        className={cx('submitButton')}
        type="submit"
        disabled={loadingSubmit || displaySuccessMsg}
        text={t(`${type}.submitBtn`)}
      />
      <div className={cx('changeLocation')}>
        {t(`${type}.changeLocation.text`)}{' '}
        <Anchor to={isLogin ? ROUTE_SIGN_UP : ROUTE_LOGIN}>
          {t(`${type}.changeLocation.cta`)}
        </Anchor>
      </div>
      {isLogin && (
        <Anchor className={cx('forgotPassword')} to={ROUTE_FORGOT_PASSWORD}>
          {t(`${type}.forgotPassword`)}
        </Anchor>
      )}
      {displaySuccessMsg ? (
        <div className={cx('success', { visible: displaySuccessMsg })}>
          {t(`${type}.successMsg`)}
        </div>
      ) : (
        <div className={cx('error', { visible: errors?.submit })}>
          {t(get('submit.message', errors), { ns: 'errors' })}
        </div>
      )}
    </form>
  );
};

Form.defaultProps = {
  displaySuccessMsg: false,
  loadingSubmit: false,
  submitError: null,
};

Form.propTypes = {
  displaySuccessMsg: bool,
  loadingSubmit: bool,
  onChange: func.isRequired,
  onSubmit: func.isRequired,
  submitError: string,
  type: oneOf([SIGN_UP_TYPE, LOGIN_TYPE, FORGOT_PASSWORD, RESET_PASSWORD])
    .isRequired,
};

export default Form;
