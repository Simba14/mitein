import React from 'react';
import classnames from 'classnames/bind';
import { arrayOf, shape, string } from 'prop-types';
import Text, { BODY_3, BODY_4, HEADING_4 } from 'components/atoms/text';

import styles from './textPage.module.scss';
import TextBanner from 'components/atoms/textBanner';
const cx = classnames.bind(styles);

export const PARAGRAPH = 'paragraph';
export const LIST = 'list';
export const TITLE = 'title';
export const SUBTITLE = 'subtitle';
export const HEADING = 'heading';
export const EMPHASIZE = 'emphasize';
export const SENTENCE = 'sentence';

const TextPage = ({ content }) => {
  return (
    <div className={cx('container')}>
      {content.map(({ text, type }) => {
        if (type === HEADING) return <TextBanner>{text}</TextBanner>;

        if (type === TITLE)
          return (
            <Text className={cx('title')} tag="h3" type={HEADING_4} bold>
              {text}
            </Text>
          );

        if (type === SUBTITLE)
          return (
            <Text className={cx('subtitle')} tag="h4" type={BODY_3} bold>
              {text}
            </Text>
          );

        if (type === PARAGRAPH)
          return <Text className={cx('paragraph')}>{text}</Text>;

        if (type === SENTENCE)
          return <Text className={cx('sentence')}>{text}</Text>;

        if (type === LIST)
          return (
            <ul className={cx('list')}>
              {text.map(item => (
                <li className={cx('listItem')} key={item}>
                  {item}
                </li>
              ))}
            </ul>
          );

        if (type === EMPHASIZE)
          return (
            <Text type={BODY_4} bold>
              {text}
            </Text>
          );
      })}
    </div>
  );
};

TextPage.propTypes = {
  content: arrayOf(shape({ type: string, text: string | arrayOf(string) })),
};

export default TextPage;
