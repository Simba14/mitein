import React, { useState } from 'react';
import { arrayOf, string, shape, any, number } from 'prop-types';
import classnames from 'classnames/bind';
import { isEmpty } from 'lodash/fp';

import Text from 'components/atoms/text';
import styles from './tabs.module.scss';
import { useEffect } from 'react';

const cx = classnames.bind(styles);

const Tabs = ({ tabs }) => {
  const [indexVisible, setIndexVisible] = useState(0);

  useEffect(() => {
    setIndexVisible(0);
  }, [tabs.length]);

  if (isEmpty(tabs)) return null;

  return (
    <div className={cx('container')}>
      <div className={cx('header')}>
        {tabs.map((tab, index) => (
          <button
            className={cx('headerItem', { active: index === indexVisible })}
            key={tab.header}
            onClick={() => setIndexVisible(index)}
          >
            <Text>
              {tab.header}
              {tab.numberOfItems && (
                <span className={cx('count')}>{tab.numberOfItems}</span>
              )}
            </Text>
          </button>
        ))}
      </div>
      <div className={cx('content')}>{tabs[indexVisible]?.content}</div>
    </div>
  );
};

Tabs.propTypes = {
  tabs: arrayOf(
    shape({
      header: string,
      numberOfItems: number,
      content: any,
    }),
  ),
};

Tabs.defaultProps = {
  tabs: null,
};

export default Tabs;
