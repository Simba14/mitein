import { useCallback, useEffect } from 'react';
import { useForm as useReactHookForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { throttle } from 'lodash';

const useForm = ({ onChange, focusOn, submitError }) => {
  const { t } = useTranslation('form');
  const {
    clearErrors,
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setError,
    setFocus,
  } = useReactHookForm();

  useEffect(() => {
    setFocus(focusOn);
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
        event.persist();
        typeof onChange === 'function' && onChange();
      },
      1000,
      { trailing: false },
    ),
    [onChange, clearErrors],
  );

  const registerInput = (name, validation) => {
    const inputProps = register(name, {
      required: t('errorMsg.required'),
      ...validation,
    });

    return {
      ...inputProps,
      onChange: e => {
        inputProps.onChange(e);
        handleOnChange(e);
      },
    };
  };

  return { getValues, errors, handleSubmit, registerInput, register };
};

export default useForm;
