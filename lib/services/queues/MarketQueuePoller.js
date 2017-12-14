import Consumer from 'sqs-consumer';
import logger from '../../utils/logger';
import config from '../../config';

const MarketQueuePoller = Consumer.create({
  queueUrl: config.AWS_SQS.scraperQueueURL,
  handleMessage: (message, done) => {
    const $message = JSON.parse(message.Body);
    logger.info(`MarketQueuePoller: Message Received ${$message.url}`);
    done();
  },
});

MarketQueuePoller.on('error', (err) => {
  logger.info(`MarketQueuePoller: Error Polling Queue ${err}`);
});

export default MarketQueuePoller;
