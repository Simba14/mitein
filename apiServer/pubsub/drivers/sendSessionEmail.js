import emailSender from '@api/pubsub/drivers/emailSender';

const sendSessionEmail = ({ email, params, templateId }) => {
  return emailSender({
    to: [
      {
        email,
      },
    ],
    templateId,
    params,
  });
};

export default sendSessionEmail;
