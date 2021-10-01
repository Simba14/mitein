import React from 'react';
import classnames from 'classnames/bind';

import CalendarSvg from 'assets/calendar.svg';
import SelectCalendarSvg from 'assets/selectCalendar.svg';
import OnlineChatSvg from 'assets/onlineChat.svg';
import RequestSvg from 'assets/emailRequest.svg';
import YesNoSvg from 'assets/yesNo.svg';
import { LEARNER } from 'constants/user';

import styles from './onboarding.module.scss';
const cx = classnames.bind(styles);

const getUserSteps = userType =>
  userType === LEARNER
    ? [
        {
          name: 'step1',
          svg: <SelectCalendarSvg className={cx('sectionImage')} />,
          className: null,
          content: `${userType}.step1.content`,
          title: `${userType}.step1.title`,
        },
        {
          name: 'step2',
          svg: <RequestSvg className={cx('sectionImage')} />,
          className: 'row-reverse',
          content: `${userType}.step2.content`,
          title: `${userType}.step2.title`,
        },
        {
          name: 'step3',
          svg: <OnlineChatSvg className={cx('sectionImage')} />,
          className: null,
          content: `${userType}.step3.content`,
          title: `${userType}.step3.title`,
        },
        {
          name: 'step4',
          svg: <CalendarSvg className={cx('sectionImage')} />,
          className: 'row-reverse',
          content: `${userType}.step4.content`,
          title: `${userType}.step4.title`,
        },
      ]
    : [
        {
          name: 'step1',
          svg: <CalendarSvg className={cx('sectionImage')} />,
          className: null,
          content: `${userType}.step1.content`,
          title: `${userType}.step1.title`,
        },
        {
          name: 'step2',
          svg: <RequestSvg className={cx('sectionImage')} />,
          className: 'row-reverse',
          content: `${userType}.step2.content`,
          title: `${userType}.step2.title`,
        },
        {
          name: 'step3',
          svg: <YesNoSvg className={cx('sectionImage')} />,
          className: null,
          content: `${userType}.step3.content`,
          title: `${userType}.step3.title`,
        },
        {
          name: 'step4',
          svg: <OnlineChatSvg className={cx('sectionImage')} />,
          className: 'row-reverse',
          content: `${userType}.step4.content`,
          title: `${userType}.step4.title`,
        },
      ];

export default getUserSteps;
