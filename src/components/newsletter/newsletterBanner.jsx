import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { get } from 'lodash/fp';

import NEWSLETTER_SIGN_UP from '@graphql/mutations/newsletterSignUp.graphql';
import Cta from 'components/cta';
import styles from './newsletter.module.scss';

const NewsletterBanner = () => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [newsletterSignUp, { loading }] = useMutation(NEWSLETTER_SIGN_UP, {
    onCompleted: () => {
      setSuccessMessage(t('newsletter:successMessage'));
    },
    onError: (error) => {
      setError('submit', {
        type: 'manual',
        message: get('graphqlErrors[0].message', error),
      });
    },
  });
  const { t } = useTranslation(['form', 'newsletter']);
  const { clearErrors, register, handleSubmit, errors, setError } = useForm();
  const formMessage = get('submit.message', errors) || successMessage;

  const onSubmit = ({ email }) => {
    newsletterSignUp({ variables: { email } });
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>{t('newsletter:heading')}</h3>
      <div className={styles.description}>{t('newsletter:description')}</div>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <input
          ref={register({ required: t('form:error.required'), validate: true })}
          className={styles.emailInput}
          id="email"
          name="email"
          placeholder={t('newsletter:placeholder')}
          type="email"
          onChange={() => {
            clearErrors('submit');
            setSuccessMessage(null);
          }}
        />
        <Cta
          className={styles.submitBtn}
          text={t('newsletter:cta')}
          disabled={loading}
        />
        <div
          className={`${styles.formMessage} ${
            errors.submit ? styles.error : ''
          } ${formMessage ? styles.visible : ''}`}
        >
          {formMessage}
        </div>
      </form>
    </div>
  );
};

export default NewsletterBanner;
