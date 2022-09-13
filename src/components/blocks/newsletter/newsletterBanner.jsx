import React, { useCallback, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { string } from 'prop-types';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { get } from 'lodash/fp';
import classnames from 'classnames/bind';

import NEWSLETTER_SIGN_UP from '@graphql/mutations/newsletterSignUp.graphql';
import Cta from 'components/atoms/cta';
import Text, { HEADING_3 } from 'components/atoms/text';
import styles from './newsletter.module.scss';
const cx = classnames.bind(styles);

const NewsletterBanner = ({ className, heading, description }) => {
  const [successMessage, setSuccessMessage] = useState(null);
  const { t } = useTranslation(['form', 'newsletter']);
  const [newsletterSignUp, { loading }] = useMutation(NEWSLETTER_SIGN_UP, {
    onCompleted: () => {
      setSuccessMessage(t('newsletter:successMessage'));
    },
    onError: error => {
      setError('submit', {
        type: 'manual',
        message: get('graphQLErrors[0].message', error) || 'Network error',
      });
    },
  });

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

  const registerInput = useCallback(() => {
    const { onChange, ...rest } = register('email', {
      required: t('form:errorMsg.required'),
      validate: true,
    });
    return {
      ...rest,
      onChange: e => {
        onChange(e);
        if (formMessage) {
          clearErrors('submit');
          setSuccessMessage(null);
        }
      },
    };
  }, [register, clearErrors, formMessage]);

  return (
    <div className={cx('container', className)}>
      <Text className={cx('heading')} tag="h3" type={HEADING_3}>
        {heading || t('newsletter:heading')}
      </Text>
      <Text className={cx('description')}>
        {description || t('newsletter:description')}
      </Text>
      <form className={cx('form')} onSubmit={handleSubmit(onSubmit)}>
        <input
          {...registerInput()}
          className={cx('emailInput')}
          id="email"
          placeholder={t('newsletter:placeholder')}
          type="email"
        />
        <Cta
          className={cx('submitBtn')}
          text={t('newsletter:cta')}
          type="submit"
          loading={loading}
        />
        <div
          role="alert"
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
