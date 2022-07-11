import emailSender from '@api/pubsub/drivers/emailSender';

const sendChatEmail = ({ emails, params, templateId }) => {
  return emailSender({
    to: emails,
    templateId,
    params,
  });
};

export default sendChatEmail;
