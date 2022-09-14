import React from 'react';
import { node, string } from 'prop-types';
import classnames from 'classnames/bind';

import Text, { BODY_4, HEADING_3 } from 'components/atoms/text';
import styles from './contentSection.module.scss';
const cx = classnames.bind(styles);

const ContentSection = ({
  anchorId,
  children,
  className,
  containerClassName,
  content,
  title,
}) => {
  return (
    <div id={anchorId} className={cx('wrapper', className)}>
      <div className={cx('container', containerClassName)}>
        {(title || content) && (
          <div className={cx('fixedContent')}>
            {title && (
              <Text className={cx('title')} tag="h3" type={HEADING_3} bold>
                {title}
              </Text>
            )}
            {content && (
              <Text className={cx('content')} type={BODY_4}>
                {content}
              </Text>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

ContentSection.propTypes = {
  anchorId: string,
  children: node,
  className: string,
  containerClassName: string,
  content: string,
  title: string,
};

ContentSection.defaultProps = {
  anchorId: null,
  className: null,
  containerClassName: null,
  content: null,
  title: null,
};

export default ContentSection;
