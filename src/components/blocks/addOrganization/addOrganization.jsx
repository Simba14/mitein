import React, { useState } from 'react';
import { get, isEmpty, map } from 'lodash/fp';
import { func, string } from 'prop-types';
import { useMutation } from '@apollo/client';
import { useTranslation } from 'next-i18next';
import classnames from 'classnames/bind';
import { toast } from 'react-toastify';
import useForm from 'hooks/useForm';

import Cta from 'components/atoms/cta';
import ConfirmPopUp from 'components/blocks/confirmPopUp';
import { FormField, ImageUploader } from 'components/blocks/form/fields';
import Text, { BODY_4, HEADING_2, HEADING_4 } from 'components/atoms/text';
// import ADD_ORGANIZATION from '@graphql/mutations/updateOrganization.graphql';

import styles from './addOrganization.module.scss';
const cx = classnames.bind(styles);

map.convert({ cap: false });

const AddOrganization = ({}) => {
  const [page, setPage] = useState(0);
  const {
    i18n: { language },
    t,
  } = useTranslation(['profile', 'errors']);

  // const { data, loading, error, refetch } = useMutation(ADD_ORGANIZATION);

  const { getValues, errors, handleSubmit, registerInput, register } = useForm({
    focusOn: 'logo',
    onChange: null,
    submitError: 'error',
  });

  // const [requestChat, { loading: loadingRequestChat }] =
  //   useMutation(REQUEST_CHAT);
  // const availableSlots = get('availableChats', data);

  // const handleConfirmClick = () => {
  //   requestChat({
  //     variables: {
  //       ...selectedChat,
  //       participant2Id: requesterId,
  //       participant2Name: requesterDisplayName,
  //       status: CHAT_STATUS_REQUESTED,
  //     },
  //   })
  //     .then(() => {
  //       selectChat(null);
  //       setChatRequested(true);
  //       setSelectedDate(null);
  //       onSelect(true);
  //     })
  //     .catch(error => {
  //       selectChat(null);
  //       setModalOpen(false);
  //       toast.error(t(error?.message, { ns: 'errors' }));
  //       onSelect(false);
  //       refetch();
  //     });
  // };

  const onSubmit = props => {
    console.log(props);
  };

  // if (loading) return null;
  const { ref } = registerInput('logo');
  return (
    <div className={cx('wrapper')}>
      <Text className={cx('heading')} type={HEADING_2} tag="h2">
        Add your organization
      </Text>
      <form className={cx('form')} onSubmit={handleSubmit(onSubmit)}>
        <ImageUploader
          ref={ref}
          errors={errors}
          name="logo"
          label={t('logo.label')}
          placeholder={t('logo.placeholder')}
          type="file"
          registerInput={registerInput}
        />
        {page ? (
          <>
            <FormField
              {...registerInput('needVolunteers')}
              errors={errors}
              name="needVolunteers"
              label={t('needVolunteers.label')}
              placeholder={t('needVolunteers.placeholder')}
              type="checkbox"
            />
            <FormField
              {...registerInput('website')}
              errors={errors}
              name="website"
              label={t('website.label')}
              placeholder={t('website.placeholder')}
              type="text"
            />
            <Cta text="Next page" onClick={() => setPage(1)} />
          </>
        ) : (
          <>
            <FormField
              {...registerInput('name')}
              errors={errors}
              name="name"
              label={t('name.label')}
              placeholder={t('name.placeholder')}
              type="text"
            />
            <FormField
              {...registerInput('description')}
              errors={errors}
              name="description"
              label={t('description.label')}
              placeholder={t('description.placeholder')}
              type="text"
            />
            <FormField
              {...registerInput('address')}
              errors={errors}
              name="address"
              label={t('address.label')}
              placeholder={t('address.placeholder')}
              type="text"
            />
            <FormField
              {...registerInput('city')}
              errors={errors}
              name="city"
              label={t('city.label')}
              placeholder={t('city.placeholder')}
              type="text"
            />
            <Cta text="Next page" type="submit" />
          </>
        )}
      </form>
    </div>
  );
};

AddOrganization.propTypes = {};

AddOrganization.defaultProps = {};

export default AddOrganization;
