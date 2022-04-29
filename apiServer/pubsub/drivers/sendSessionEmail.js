import emailSender from '@api/pubsub/drivers/emailSender';

const sendSessionEmail = ({ emails, params, templateId }) => {
  return emailSender({
    to: emails,
    templateId,
    params,
  });
};

export default sendSessionEmail;
