import SibApiV3Sdk from 'sib-api-v3-sdk';
import config from '@api/config';
const defaultClient = SibApiV3Sdk.ApiClient.instance;

const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = config.sendinblue.apiKey;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

const DEFAULT_DELAY = 1000; // ms

const wait = duration => new Promise(res => setTimeout(res, duration));

const retry = ({ fn, args, attempt = 1, retries = 3 }) => {
  const delay = attempt * DEFAULT_DELAY;
  return fn(args).catch(err =>
    retries > 1
      ? wait(delay).then(() =>
          retry({ fn, args, attempt: attempt + 1, retries: retries - 1 }),
        )
      : Promise.reject(err),
  );
};

const emailSender = sendSmtpEmail =>
  apiInstance.sendTransacEmail(sendSmtpEmail).then(() => true);

const emailSenderWithRetry = args => retry({ fn: emailSender, args });

export default emailSenderWithRetry;
