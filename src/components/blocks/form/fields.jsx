import React, { forwardRef, useState } from 'react';
import classnames from 'classnames/bind';
import { any, func, shape, string } from 'prop-types';
import { get } from 'lodash/fp';

import styles from './fields.module.scss';
import { element } from 'prop-types';
import { useRef } from 'react';
const cx = classnames.bind(styles);

export const ImageUploader = forwardRef(
  ({ label, name, onBlur, placeholder, errors, registerInput }, ref) => {
    // React hook form requirement to share ref usage
    const inputRef = useRef();
    const [image, setImage] = useState(null);

    const handleClick = () => {
      console.log(ref.current, inputRef.current);
      inputRef.current.click();
    };
    const handleChange = event => {
      const imageUrl = URL.createObjectURL(event.target.files[0]);
      console.log({ imageUrl });
      setImage(imageUrl);
    };

    return (
      <div className={cx('fieldContainer')}>
        <label htmlFor={name}>{label}</label>
        <button className={cx('imageBtn')} onClick={handleClick}>
          {image ? (
            <img
              className={cx('image')}
              alt={'image uploaded for organization'}
              src={image}
            />
          ) : (
            'Upload your bluddy image'
          )}
        </button>
        <input
          ref={e => {
            ref(e);
            inputRef.current = e;
          }}
          onBlur={onBlur}
          className={cx('fileInput')}
          accept="image/*"
          id={name}
          onChange={handleChange}
          placeholder={placeholder}
          type="file"
        />
        <div className={cx('fieldError')}>{get(`${name}.message`, errors)}</div>
      </div>
    );
  },
);

ImageUploader.displayName = 'ImageUploader';

export const FormField = forwardRef(
  (
    { errors, onBlur, onChange, name, label, placeholder, selectOptions, type },
    ref,
  ) => (
    <div className={cx('fieldContainer', { hasError: errors[name] })}>
      <label htmlFor={name}>{label}</label>
      {selectOptions ? (
        <select
          className={cx('dropdown')}
          ref={ref}
          onChange={onChange}
          onBlur={onBlur}
          id={name}
        >
          {selectOptions}
        </select>
      ) : (
        <>
          <input
            ref={ref}
            onChange={onChange}
            onBlur={onBlur}
            className={cx('textInput')}
            id={name}
            placeholder={placeholder}
            type={type}
            onClick={() => console.log(ref.current)}
          />
          <div className={cx('fieldError')}>
            {get(`${name}.message`, errors)}
          </div>
        </>
      )}
    </div>
  ),
);

FormField.displayName = 'FormField';

FormField.propTypes = {
  errors: shape({
    email: shape({
      message: string,
    }),
  }),
  onBlur: func.isRequired,
  onChange: func.isRequired,
  label: string.isRequired,
  placeholder: string,
  name: string.isRequired,
  selectOptions: element,
  type: string,
  fieldProps: any,
};
