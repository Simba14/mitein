import { PubSub } from '@google-cloud/pubsub';
import { log } from '@api/logger';
import config from '@api/config';
import usersMessageHandler from './handlers/users/usersMessageHandler';
import sessionsMessageHandler from './handlers/sessions/sessionsMessageHandler';

export const USER_CREATED_MESSAGE_TYPE = 'UserCreated';
export const USER_PASSWORD_RESET_REQUEST_MESSAGE_TYPE =
  'UserPasswordResetRequest';
export const USER_VERIFY_EMAIL_REQUEST_MESSAGE_TYPE = 'UserVerifyEmailRequest';
export const SESSION_BOOKED_MESSAGE_TYPE = 'SessionBooked';
export const SESSION_REQUESTED_MESSAGE_TYPE = 'SessionRequested';

const SESSIONS = 'sessions';
const USERS = 'users';
const NOTIFICATIONS = 'notifications';

const subscriptions = [
  {
    topic: SESSIONS,
    name: NOTIFICATIONS,
    messageHandler: sessionsMessageHandler,
  },
  {
    topic: USERS,
    name: NOTIFICATIONS,
    messageHandler: usersMessageHandler,
  },
];

const topics = {
  [SESSIONS]: { name: config.gcp.topics.sessions },
  [USERS]: { name: config.gcp.topics.users },
};

const PubSubService = () => {
  const pubsubService = {};

  const pubsub = new PubSub({
    projectId: config.gcp.projectId,
    credentials: {
      client_email: config.gcp.email,
      private_key: config.gcp.privateKey,
    },
  });

  const createSubscription = async (topicName, subscriptionName) => {
    try {
      const [subscription] = await pubsub
        .topic(topicName)
        .subscription(subscriptionName)
        .get();

      return subscription;
    } catch (error) {
      const [subscription] = await pubsub
        .topic(topicName)
        .createSubscription(subscriptionName);

      return subscription;
    }
  };

  const listenForMessages = ({ subscriptionName, messageHandler }) => {
    const subscription = pubsub.subscription(subscriptionName);

    const handleMessage = async message => {
      const start = Date.now();
      const data = JSON.parse(message.data);

      try {
        log(`Processing message ${message.id}, type: ${data.type}`);
        await messageHandler(data);

        log(
          `Acknowledging type ${data.type} message after ${
            Date.now() - start
          }ms)`,
        );
        message.ack();

        log(
          `Processed message ${message.id}, type: ${data.type} message in ${
            Date.now() - start
          }ms`,
        );
      } catch (error) {
        log('Error processing message', 'error', error);
      }
    };

    subscription.on('message', handleMessage);
    subscription.on('error', error => {
      log('Error on pubsub subscription', 'error', error);
    });

    setInterval(() => {
      log(`removing listener from ${subscriptionName}`);
      subscription.removeListener('message', handleMessage);
      subscription.on('message', handleMessage);
      log(`subscribing listener to ${subscriptionName}`);
    }, config.gcp.restartSubscriptionIntervalInMinutes * 60 * 1000);
  };

  pubsubService.publishMessage = ({ message, topic }) => {
    const data = JSON.stringify(message);
    const dataBuffer = Buffer.from(data);

    return pubsub.topic(topic).publisher.publish(dataBuffer);
  };

  pubsubService.init = async () => {
    for (const subscription of subscriptions) {
      const topic = topics[subscription.topic];

      if (topic) {
        const fullSubscriptionName = `${topic.name}-${subscription.name}-subscription`;
        const pubSubSubscription = await createSubscription(
          topic.name,
          fullSubscriptionName,
        );
        const [metadata] = await pubSubSubscription.getMetadata();

        log(
          `Subscribed to "${metadata.name}" on topic "${topic.name}"`,
          'info',
          {
            pubsubSubscriptionName: fullSubscriptionName,
            pubsubTopicName: topic.name,
          },
        );

        listenForMessages({
          subscriptionName: fullSubscriptionName,
          messageHandler: subscription.messageHandler,
        });

        log(
          `Listening to messages on subscription "${fullSubscriptionName}" on topic "${topic.name}"`,
          'info',
          {
            pubsubSubscriptionName: fullSubscriptionName,
            pubsubTopicName: topic.name,
          },
        );
      }
    }
  };

  return pubsubService;
};

export default PubSubService;
