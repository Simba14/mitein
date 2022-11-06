import React from 'react';
import classnames from 'classnames/bind';
import { useTranslation } from 'next-i18next';
import { bool, func, oneOf, string } from 'prop-types';
import { get } from 'lodash/fp';
import useForm from 'hooks/useForm';

import Anchor from 'components/atoms/anchor';
import Cta from 'components/atoms/cta';
import { FormField } from 'components/blocks/form/fields';
import { ROUTE_FORGOT_PASSWORD, ROUTE_LOGIN, ROUTE_SIGN_UP } from 'routes';
import {
  USER_TYPE_LEARNER,
  USER_TYPE_NATIVE,
  USER_TYPE_REPRESENTATIVE,
} from '@api/firebase/constants';

import styles from './accountForm.module.scss';
const cx = classnames.bind(styles);

export const SIGN_UP_TYPE = 'signUp';
export const LOGIN_TYPE = 'login';
export const FORGOT_PASSWORD = 'forgotPassword';
export const RESET_PASSWORD = 'resetPassword';

const AccountForm = ({
  displaySuccessMsg,
  submitError,
  loadingSubmit,
  onChange,
  onSubmit,
  type,
}) => {
  const isSignUp = type === SIGN_UP_TYPE;
  const isLogin = type === LOGIN_TYPE;
  const isForgotPassword = type === FORGOT_PASSWORD;
  const isResetPassword = type === RESET_PASSWORD;

  const { getValues, errors, handleSubmit, registerInput, register } = useForm({
    focusOn: isResetPassword ? 'password' : 'email',
    onChange,
    submitError,
  });

  const { t } = useTranslation(['form', 'errors']);

  return (
    <form className={cx('form')} onSubmit={handleSubmit(onSubmit)}>
      {!isResetPassword && (
        <FormField
          errors={errors}
          name={'email'}
          fieldProps={registerInput('email')}
          placeholder={t('email')}
          label={t('email')}
          type="email"
        />
      )}
      {!isForgotPassword && (
        <FormField
          errors={errors}
          name={'password'}
          placeholder={t('password')}
          label={t('password')}
          fieldProps={registerInput('password')}
          type="password"
        />
      )}
      {(isSignUp || isResetPassword) && (
        <FormField
          errors={errors}
          name={'confirmPassword'}
          placeholder={t('password')}
          label={t('confirmPassword')}
          fieldProps={registerInput('confirmPassword', {
            validate: {
              passwordsMatch: v =>
                getValues().password === v || t('confirmPasswordError'),
            },
          })}
          type="password"
        />
      )}
      {isSignUp && (
        <>
          <FormField
            errors={errors}
            name={'displayName'}
            placeholder={t('displayName.placeholder')}
            label={t('displayName.label')}
            fieldProps={registerInput('displayName', {
              validate: {
                oneWord: name =>
                  name.trim().split(' ').length === 1 || t('displayName.error'),
              },
            })}
            type="text"
          />

          <FormField
            errors={errors}
            name={'accountType'}
            label={t('accountType.label')}
            fieldProps={register('accountType')}
            selectOptions={
              <>
                <option value={USER_TYPE_LEARNER}>
                  {t('accountType.learner')}
                </option>
                <option value={USER_TYPE_NATIVE}>
                  {t('accountType.native')}
                </option>
                <option value={USER_TYPE_REPRESENTATIVE}>
                  {t('accountType.representative')}
                </option>
              </>
            }
            type="text"
          />
        </>
      )}
      <Cta
        className={cx('submitButton')}
        type="submit"
        disabled={loadingSubmit || displaySuccessMsg}
        text={t(`${type}.submitBtn`)}
        loading={loadingSubmit}
        fullWidth
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

AccountForm.defaultProps = {
  displaySuccessMsg: false,
  loadingSubmit: false,
  submitError: null,
};

AccountForm.propTypes = {
  displaySuccessMsg: bool,
  loadingSubmit: bool,
  onChange: func.isRequired,
  onSubmit: func.isRequired,
  submitError: string,
  type: oneOf([SIGN_UP_TYPE, LOGIN_TYPE, FORGOT_PASSWORD, RESET_PASSWORD])
    .isRequired,
};

export default AccountForm;
