import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { string } from 'prop-types';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { get } from 'lodash/fp';
import classnames from 'classnames/bind';

import NEWSLETTER_SIGN_UP from '@graphql/mutations/newsletterSignUp.graphql';
import Cta from 'components/cta';
import styles from './newsletter.module.scss';
const cx = classnames.bind(styles);

const NewsletterBanner = ({ className, heading, description }) => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [newsletterSignUp, { loading }] = useMutation(NEWSLETTER_SIGN_UP, {
    onCompleted: () => {
      setSuccessMessage(t('newsletter:successMessage'));
    },
    onError: error => {
      setError('submit', {
        type: 'manual',
        message: get('graphqlErrors[0].message', error),
      });
    },
  });
  const { t } = useTranslation(['form', 'newsletter']);
  const {
    clearErrors,
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();
  const formMessage = get('submit.message', errors) || successMessage;

  const onSubmit = ({ email }) => {
    newsletterSignUp({ variables: { email } });
  };

  return (
    <div className={cx('container', className)}>
      <h3 className={cx('heading')}>{heading || t('newsletter:heading')}</h3>
      <div className={cx('description')}>
        {description || t('newsletter:description')}
      </div>
      <form className={cx('form')} onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register('email', {
            required: t('form:errorMsg.required'),
            validate: true,
          })}
          className={cx('emailInput')}
          id="email"
          placeholder={t('newsletter:placeholder')}
          type="email"
          onChange={() => {
            clearErrors('submit');
            setSuccessMessage(null);
          }}
        />
        <Cta
          className={cx('submitBtn')}
          text={t('newsletter:cta')}
          disabled={loading}
        />
        <div
          className={cx('formMessage', {
            error: errors.submit,
            visible: formMessage,
          })}
        >
          {formMessage}
        </div>
      </form>
    </div>
  );
};

NewsletterBanner.propTypes = {
  className: string,
  heading: string,
  description: string,
};

NewsletterBanner.defaultProps = {
  className: null,
  heading: null,
  description: null,
};

export default NewsletterBanner;
