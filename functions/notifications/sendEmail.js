// const { log } = require('../../apiServer/logger');
const SibApiV3Sdk = require('sib-api-v3-sdk');
const defaultClient = SibApiV3Sdk.ApiClient.instance;

const sendEmail = key => {
  const apiKey = defaultClient.authentications['api-key'];
  apiKey.apiKey = key;

  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  return sendSmtpEmail =>
    apiInstance
      .sendTransacEmail(sendSmtpEmail)
      .then(data => {
        console.log('sent scheduled email', 'info', { data });
        return true;
      })
      .catch(error => {
        console.log('error sending scheduled email', 'error', error);
        return false;
      });
};

exports.sendEmail = sendEmail;
