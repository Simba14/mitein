const SibApiV3Sdk = require('sib-api-v3-sdk');
const { config } = require('firebase-functions');
const defaultClient = SibApiV3Sdk.ApiClient.instance;

const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = config().sendinblue.key;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

const sendEmail = sendSmtpEmail => {
  apiInstance
    .sendTransacEmail(sendSmtpEmail)
    .then(data => {
      console.log('sent email', { data });
      return true;
    })
    .catch(error => {
      console.error('send error', error);
      return false;
    });
};

exports.sendEmail = sendEmail;
