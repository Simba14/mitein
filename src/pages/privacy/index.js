import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import TextPage, {
  HEADING,
  TITLE,
  SUBTITLE,
  PARAGRAPH,
  LIST,
  SENTENCE,
} from 'components/blocks/textPage';
import { withLayout } from 'components/blocks/layout';

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'privacy', 'menu'])),
  },
});

const content = [
  { text: 'PRIVACY NOTICE', type: HEADING },
  { text: 'Last updated April 22, 2022', type: PARAGRAPH },
  {
    text: 'This privacy notice for Mitein ("Company," "we," "us," or "our"), describes how and why we might collect, store, use, and/or share ("process") your information when you use our services ("Services"), such as when you:',
    type: PARAGRAPH,
  },
  {
    text: [
      'Visit our website at http://www.mitein.de, or any website of ours that links to this privacy notice',
      'Engage with us in other related ways, including any sales, marketing, or events',
    ],
    type: LIST,
  },
  {
    text: 'Questions or concerns? Reading this privacy notice will help you understand your privacy rights and choices. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at info@mitein.de.',
    type: PARAGRAPH,
  },
  { text: 'SUMMARY OF KEY POINTS', type: TITLE },
  {
    text: 'This summary provides key points from our privacy notice, but you can find out more details about any of these topics by clicking the link following each key point or by using our table of contents below to find the section you are looking for. You can also click here to go directly to our table of contents.',
    type: PARAGRAPH,
  },
  {
    text: 'What personal information do we process? When you visit, use, or navigate our Services, we may process personal information depending on how you interact with Mitein and the Services, the choices you make, and the products and features you use. Click here to learn more.',
    type: PARAGRAPH,
  },
  {
    text: 'Do we process any sensitive personal information? We do not process sensitive personal information.',
    type: PARAGRAPH,
  },

  {
    text: 'Do you receive any information from third parties? We do not receive any information from third parties.',
    type: PARAGRAPH,
  },
  {
    text: 'How do you process my information? We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent. We process your information only when we have a valid legal reason to do so. Click here to learn more.',
    type: PARAGRAPH,
  },
  {
    text: 'In what situations and with which parties do we share personal information? We may share information in specific situations and with specific third parties. Click here to learn more.',
    type: PARAGRAPH,
  },
  {
    text: 'How do we keep your information safe? We have organizational and technical processes and procedures in place to protect your personal information. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information. Click here to learn more.',
    type: PARAGRAPH,
  },
  {
    text: 'What are your rights? Depending on where you are located geographically, the applicable privacy law may mean you have certain rights regarding your personal information. Click here to learn more.',
    type: PARAGRAPH,
  },
  {
    text: 'How do I exercise my rights? The easiest way to exercise your rights is by contacting us. We will consider and act upon any request in accordance with applicable data protection laws.',
    type: PARAGRAPH,
  },
  {
    text: 'TABLE OF CONTENTS',
    type: TITLE,
  },
  {
    text: '1. WHAT INFORMATION DO WE COLLECT?',
    type: SENTENCE,
  },
  { text: '2. HOW DO WE PROCESS YOUR INFORMATION?', type: SENTENCE },
  {
    text: '3. WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR PERSONAL INFORMATION?',
    type: SENTENCE,
  },
  {
    text: '4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?',
    type: SENTENCE,
  },
  {
    text: '5. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?',
    type: SENTENCE,
  },
  { text: '6. HOW LONG DO WE KEEP YOUR INFORMATION?', type: SENTENCE },
  { text: '7. HOW DO WE KEEP YOUR INFORMATION SAFE?', type: SENTENCE },
  { text: '8. DO WE COLLECT INFORMATION FROM MINORS?', type: SENTENCE },
  { text: '9. WHAT ARE YOUR PRIVACY RIGHTS?', type: SENTENCE },
  { text: '10. CONTROLS FOR DO-NOT-TRACK FEATURES', type: SENTENCE },
  {
    text: '11. DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?',
    type: SENTENCE,
  },
  { text: '12. DO WE MAKE UPDATES TO THIS NOTICE?', type: SENTENCE },
  { text: '13. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?', type: SENTENCE },
  {
    text: '14. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?',
    type: PARAGRAPH,
  },
  { text: '1. WHAT INFORMATION DO WE COLLECT?', type: TITLE },
  {
    text: 'Personal information you disclose to us',
    type: SUBTITLE,
  },
  {
    text: 'In Short: We collect personal information that you provide to us.',
    type: PARAGRAPH,
  },
  {
    text: 'We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.',
    type: PARAGRAPH,
  },
  {
    text: 'Personal Information Provided by You. The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use. The personal information we collect may include the following:',
    type: PARAGRAPH,
  },
  {
    text: [
      'names',
      'phone numbers',
      'email addresses',
      'contact preferences',
      'passwords',
    ],
    type: LIST,
  },
  {
    text: 'Sensitive Information. We do not process sensitive information.',
    type: PARAGRAPH,
  },
  {
    text: 'All personal information that you provide to us must be true, complete, and accurate, and you must notify us of any changes to such personal information.',
    type: PARAGRAPH,
  },
  { text: '2. HOW DO WE PROCESS YOUR INFORMATION?', type: TITLE },
  {
    text: 'In Short: We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent.',
    type: PARAGRAPH,
  },
  {
    text: 'We process your personal information for a variety of reasons, depending on how you interact with our Services, including:',
    type: PARAGRAPH,
  },
  {
    text: [
      'To facilitate account creation and authentication and otherwise manage user accounts. We may process your information so you can create and log in to your account, as well as keep your account in working order.',
      'To deliver and facilitate delivery of services to the user. We may process your information to provide you with the requested service.',
      'To send administrative information to you. We may process your information to send you details about our products and services, changes to our terms and policies, and other similar information.',
      'To enable user-to-user communications. We may process your information if you choose to use any of our offerings that allow for communication with another user.',
      'To request feedback. We may process your information when necessary to request feedback and to contact you about your use of our Services.',
      'To send you marketing and promotional communications. We may process the personal information you send to us for our marketing purposes, if this is in accordance with your marketing preferences. You can opt out of our marketing emails at any time. For more information, see "WHAT ARE YOUR PRIVACY RIGHTS?" below).',
      'To protect our Services. We may process your information as part of our efforts to keep our Services safe and secure, including fraud monitoring and prevention.',
      'To identify usage trends. We may process information about how you use our Services to better understand how they are being used so we can improve them.',
      "To save or protect an individual's vital interest. We may process your information when necessary to save or protect an individual’s vital interest, such as to prevent harm.", // eslint-disable-line quotes
    ],
    type: LIST,
  },
  {
    text: '3. WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR INFORMATION?',
    type: TITLE,
  },
  {
    text: 'In Short: We only process your personal information when we believe it is necessary and we have a valid legal reason (i.e., legal basis) to do so under applicable law, like with your consent, to comply with laws, to provide you with services to enter into or fulfill our contractual obligations, to protect your rights, or to fulfill our legitimate business interests.',
    type: PARAGRAPH,
  },
  {
    text: 'The General Data Protection Regulation (GDPR) and UK GDPR require us to explain the valid legal bases we rely on in order to process your personal information. As such, we may rely on the following legal bases to process your personal information:',
    type: PARAGRAPH,
  },
  {
    text: [
      'Consent. We may process your information if you have given us permission (i.e., consent) to use your personal information for a specific purpose. You can withdraw your consent at any time. Click here to learn more.',
      'Performance of a Contract. We may process your personal information when we believe it is necessary to fulfill our contractual obligations to you, including providing our Services or at your request prior to entering into a contract with you.',
      'Legitimate Interests. We may process your information when we believe it is reasonably necessary to achieve our legitimate business interests and those interests do not outweigh your interests and fundamental rights and freedoms. For example, we may process your personal information for some of the purposes described in order to: Send users information about special offers and discounts on our products and services. Analyze how our services are used so we can improve them to engage and retain users. Diagnose problems and/or prevent fraudulent activities. Understand how our users use our products and services so we can improve user experience',
      'Legal Obligations. We may process your information where we believe it is necessary for compliance with our legal obligations, such as to cooperate with a law enforcement body or regulatory agency, exercise or defend our legal rights, or disclose your information as evidence in litigation in which we are involved.',
      'Vital Interests. We may process your information where we believe it is necessary to protect your vital interests or the vital interests of a third party, such as situations involving potential threats to the safety of any person.',
    ],
    type: LIST,
  },
  {
    text: '4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?',
    type: TITLE,
  },
  {
    text: 'In Short: We may share information in specific situations described in this section and/or with the following third parties.',
    type: PARAGRAPH,
  },
  {
    text: 'We may need to share your personal information in the following situations:',
    type: PARAGRAPH,
  },
  {
    text: [
      'Business Transfers. We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.',
    ],
    type: LIST,
  },
  {
    text: '5. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?',
    type: TITLE,
  },
  {
    text: 'In Short: We may use cookies and other tracking technologies to collect and store your information.',
    type: PARAGRAPH,
  },
  {
    text: 'We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice: http://www.mitein.de/cookie-policy.',
    type: PARAGRAPH,
  },
  { text: '6. HOW LONG DO WE KEEP YOUR INFORMATION?', type: TITLE },
  {
    text: 'In Short: We keep your information for as long as necessary to fulfill the purposes outlined in this privacy notice unless otherwise required by law.',
    type: PARAGRAPH,
  },
  {
    text: 'We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements). No purpose in this notice will require us keeping your personal information for longer than the period of time in which users have an account with us.',
    type: PARAGRAPH,
  },
  {
    text: 'When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize such information, or, if this is not possible (for example, because your personal information has been stored in backup archives), then we will securely store your personal information and isolate it from any further processing until deletion is possible.',
    type: PARAGRAPH,
  },
  { text: '7. HOW DO WE KEEP YOUR INFORMATION SAFE?', type: TITLE },
  {
    text: 'In Short: We aim to protect your personal information through a system of organizational and technical security measures.',
    type: PARAGRAPH,
  },
  {
    text: 'We have implemented appropriate and reasonable technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information. Although we will do our best to protect your personal information, transmission of personal information to and from our Services is at your own risk. You should only access the Services within a secure environment.',
    type: PARAGRAPH,
  },
  { text: '8. DO WE COLLECT INFORMATION FROM MINORS?', type: TITLE },
  {
    text: 'In Short: We do not knowingly collect data from or market to children under 18 years of age.',
    type: PARAGRAPH,
  },
  {
    text: 'We do not knowingly solicit data from or market to children under 18 years of age. By using the Services, you represent that you are at least 18 or that you are the parent or guardian of such a minor and consent to such minor dependent’s use of the Services. If we learn that personal information from users less than 18 years of age has been collected, we will deactivate the account and take reasonable measures to promptly delete such data from our records. If you become aware of any data we may have collected from children under age 18, please contact us at info@mitein.de.',
    type: PARAGRAPH,
  },
  { text: '9. WHAT ARE YOUR PRIVACY RIGHTS?', type: TITLE },
  {
    text: 'In Short: In some regions, such as the European Economic Area (EEA) and United Kingdom (UK), you have rights that allow you greater access to and control over your personal information. You may review, change, or terminate your account at any time.',
    type: PARAGRAPH,
  },
  {
    text: 'In some regions (like the EEA and UK), you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; and (iv) if applicable, to data portability. In certain circumstances, you may also have the right to object to the processing of your personal information. You can make such a request by contacting us by using the contact details provided in the section “HOW CAN YOU CONTACT US ABOUT THIS NOTICE?” below.',
    type: PARAGRAPH,
  },
  {
    text: 'We will consider and act upon any request in accordance with applicable data protection laws.',
    type: PARAGRAPH,
  },
  {
    text: 'If you are located in the EEA or UK and you believe we are unlawfully processing your personal information, you also have the right to complain to your local data protection supervisory authority. You can find their contact details here: https://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm.',
    type: PARAGRAPH,
  },
  {
    text: 'If you are located in Switzerland, the contact details for the data protection authorities are available here: https://www.edoeb.admin.ch/edoeb/en/home.html.',
    type: PARAGRAPH,
  },
  {
    text: 'Withdrawing your consent: If we are relying on your consent to process your personal information, you have the right to withdraw your consent at any time. You can withdraw your consent at any time by contacting us by using the contact details provided in the section "HOW CAN YOU CONTACT US ABOUT THIS NOTICE?" below or updating your preferences.',
    type: PARAGRAPH,
  },
  {
    text: 'However, please note that this will not affect the lawfulness of the processing before its withdrawal, nor will it affect the processing of your personal information conducted in reliance on lawful processing grounds other than consent.',
    type: PARAGRAPH,
  },
  {
    text: 'Opting out of marketing and promotional communications: You can unsubscribe from our marketing and promotional communications at any time by clicking on the unsubscribe link in the emails that we send, or by contacting us using the details provided in the section "HOW CAN YOU CONTACT US ABOUT THIS NOTICE?" below. You will then be removed from the marketing lists. However, we may still communicate with you — for example, to send you service-related messages that are necessary for the administration and use of your account, to respond to service requests, or for other non-marketing purposes.',
    type: PARAGRAPH,
  },
  { text: 'Account Information', type: SUBTITLE },
  {
    text: 'If you would at any time like to review or change the information in your account or terminate your account, you can:',
    type: PARAGRAPH,
  },
  {
    text: [
      'Log in to your account settings and update your user account.',
      'Contact us using the contact information provided.',
    ],
    type: LIST,
  },
  {
    text: 'Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, we may retain some information in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our legal terms and/or comply with applicable legal requirements.',
    type: PARAGRAPH,
  },
  {
    text: 'Cookies and similar technologies: Most Web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove cookies and to reject cookies. If you choose to remove cookies or reject cookies, this could affect certain features or services of our Services. To opt out of interest-based advertising by advertisers on our Services visit http://www.aboutads.info/choices/. For further information, please see our Cookie Notice: http://www.mitein.de/cookie-policy.',
    type: PARAGRAPH,
  },
  {
    text: 'If you have questions or comments about your privacy rights, you may email us at info@mitein.de.',
    type: PARAGRAPH,
  },
  { text: '10. CONTROLS FOR DO-NOT-TRACK FEATURES', type: TITLE },
  {
    text: 'Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track ("DNT") feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. At this stage no uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online. If a standard for online tracking is adopted that we must follow in the future, we will inform you about that practice in a revised version of this privacy notice.',
    type: PARAGRAPH,
  },
  {
    text: '11. DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?',
    type: TITLE,
  },
  {
    text: 'In Short: Yes, if you are a resident of California, you are granted specific rights regarding access to your personal information.',
    type: PARAGRAPH,
  },
  {
    text: 'California Civil Code Section 1798.83, also known as the "Shine The Light" law, permits our users who are California residents to request and obtain from us, once a year and free of charge, information about categories of personal information (if any) we disclosed to third parties for direct marketing purposes and the names and addresses of all third parties with which we shared personal information in the immediately preceding calendar year. If you are a California resident and would like to make such a request, please submit your request in writing to us using the contact information provided below.',
    type: PARAGRAPH,
  },
  {
    text: 'If you are under 18 years of age, reside in California, and have a registered account with Services, you have the right to request removal of unwanted data that you publicly post on the Services. To request removal of such data, please contact us using the contact information provided below and include the email address associated with your account and a statement that you reside in California. We will make sure the data is not publicly displayed on the Services, but please be aware that the data may not be completely or comprehensively removed from all our systems (e.g., backups, etc.).',
    type: PARAGRAPH,
  },
  { text: '12. DO WE MAKE UPDATES TO THIS NOTICE?', type: TITLE },
  {
    text: 'In Short: Yes, we will update this notice as necessary to stay compliant with relevant laws.',
    type: PARAGRAPH,
  },
  {
    text: 'We may update this privacy notice from time to time. The updated version will be indicated by an updated "Revised" date and the updated version will be effective as soon as it is accessible. If we make material changes to this privacy notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this privacy notice frequently to be informed of how we are protecting your information.',
    type: PARAGRAPH,
  },
  { text: '13. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?', type: TITLE },
  {
    text: 'If you have questions or comments about this notice, you may contact our Data Protection Officer (DPO), by email at info@mitein.de',
    type: PARAGRAPH,
  },
  {
    text: '14. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?',
    type: TITLE,
  },
  {
    text: 'Based on the applicable laws of your country, you may have the right to request access to the personal information we collect from you, change that information, or delete it in some circumstances. To request to review, update, or delete your personal information, please email info@mitein.de.',
    type: PARAGRAPH,
  },
];

const Privacy = () => {
  return <TextPage content={content} />;
};

export default withLayout(Privacy);
