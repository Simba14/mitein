import CalendarSvg from 'assets/calendar.svg';
import SelectCalendarSvg from 'assets/selectCalendar.svg';
import OnlineChatSvg from 'assets/onlineChat.svg';
import RequestSvg from 'assets/emailRequest.svg';
import YesNoSvg from 'assets/yesNo.svg';
import { LEARNER } from '@constants/user';

const getUserSteps = userType =>
  userType === LEARNER
    ? [
        {
          name: 'step1',
          svg: SelectCalendarSvg,
          className: null,
          content: `${userType}.step1.content`,
          title: `${userType}.step1.title`,
        },
        {
          name: 'step2',
          svg: RequestSvg,
          className: 'row-reverse',
          content: `${userType}.step2.content`,
          title: `${userType}.step2.title`,
        },
        {
          name: 'step3',
          svg: OnlineChatSvg,
          className: null,
          content: `${userType}.step3.content`,
          title: `${userType}.step3.title`,
        },
        {
          name: 'step4',
          svg: CalendarSvg,
          className: 'row-reverse',
          content: `${userType}.step4.content`,
          title: `${userType}.step4.title`,
        },
      ]
    : [
        {
          name: 'step1',
          svg: CalendarSvg,
          className: null,
          content: `${userType}.step1.content`,
          title: `${userType}.step1.title`,
        },
        {
          name: 'step2',
          svg: RequestSvg,
          className: 'row-reverse',
          content: `${userType}.step2.content`,
          title: `${userType}.step2.title`,
        },
        {
          name: 'step3',
          svg: YesNoSvg,
          className: null,
          content: `${userType}.step3.content`,
          title: `${userType}.step3.title`,
        },
        {
          name: 'step4',
          svg: OnlineChatSvg,
          className: 'row-reverse',
          content: `${userType}.step4.content`,
          title: `${userType}.step4.title`,
        },
      ];

export default getUserSteps;
