import SibApiV3Sdk from 'sib-api-v3-sdk';
import config from '@api/config';
const defaultClient = SibApiV3Sdk.ApiClient.instance;

const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = config.sendinblue.apiKey;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

const emailSender = sendSmtpEmail => {
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

export default emailSender;
