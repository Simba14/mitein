import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import classnames from 'classnames/bind';
import { useTranslation } from 'next-i18next';
import { without } from 'lodash';

import Cta from 'components/atoms/cta';
import Modal from 'components/atoms/modal';
import Text, { BODY_6, HEADING_2, HEADING_4 } from 'components/atoms/text';
import Svg, { CLOSE } from 'components/atoms/svg';
import { sessionProps } from 'context/session';

import UPDATE_PersonalInfo from '@graphql/mutations/updateUser.graphql';
import { INTERESTS } from '@constants/user';

import styles from './personalInfo.module.scss';
import { arrayOf, string } from 'prop-types';

const cx = classnames.bind(styles);

const PersonalInfo = ({ displayName, email, interests, userId }) => {
  const { t } = useTranslation('profile');
  const [interestsOpen, setInterestsOpen] = useState(false);

  const [updatePersonalInfo] = useMutation(UPDATE_PersonalInfo);

  const handleUpdatePersonalInfo = ({ addInterest, deleteInterest }) => {
    updatePersonalInfo({
      variables: {
        id: userId,
        fields: {
          interests: deleteInterest
            ? without(interests, deleteInterest)
            : [...(interests || []), addInterest],
        },
      },
    });
  };

  return (
    <div className={cx('container')}>
      <Text className={cx('title')} tag="h1" type={HEADING_2}>
        {t('title')}
      </Text>
      <Text>{t('email', { email })}</Text>
      <Text className={cx('displayName')}>{t('name', { displayName })}</Text>
      <div className={cx('interests')}>
        <Text className={cx('label')} tag="label">
          {t('interests.label')}
        </Text>
        {interests?.length ? (
          interests.map(interest => (
            <button
              key={`selected ${interest}`}
              className={cx('interest')}
              onClick={() =>
                handleUpdatePersonalInfo({ deleteInterest: interest })
              }
            >
              {t(`interests.${interest}`)}
              <Svg className={cx('delete')} name={CLOSE} />
            </button>
          ))
        ) : (
          <Text type={BODY_6}>{t('interests.none')}</Text>
        )}
        <Cta
          aria-label={t('interests.editLabel')}
          aria-haspopup="dialog"
          className={cx('edit')}
          onClick={() => setInterestsOpen(true)}
          text={t('interests.edit')}
        />
      </div>

      <Modal open={interestsOpen} onClose={() => setInterestsOpen(false)}>
        <div className={cx('addInterests')}>
          <Text className={cx('interestsHeading')} type={HEADING_4}>
            {t('interests.heading')}
          </Text>
          <Text className={cx('description')} type={BODY_6}>
            {t('interests.description')}
          </Text>
          <Text className={cx('instruction')} type={BODY_6} tag="strong">
            {t('interests.instructions')}
          </Text>
          <div className={cx('options')}>
            {INTERESTS.map(interest => {
              const selected = interests?.find(el => el === interest);
              return (
                <button
                  key={interest}
                  className={cx('interest', { selected })}
                  onClick={() =>
                    handleUpdatePersonalInfo({
                      [selected ? 'deleteInterest' : 'addInterest']: interest,
                    })
                  }
                >
                  {t(`interests.${interest}`)}
                </button>
              );
            })}
          </div>
          <Cta
            onClick={() => setInterestsOpen(false)}
            text={t('interests.cta')}
          />
        </div>
      </Modal>
    </div>
  );
};

PersonalInfo.propTypes = {
  session: sessionProps,
  displayName: string,
  email: string,
  interests: arrayOf(string),
  userId: string,
};

export default PersonalInfo;
