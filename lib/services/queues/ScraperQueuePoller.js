import Consumer from 'sqs-consumer';
import logger from '../../utils/logger';
import config from '../../config';

const ScrapeQueuePoller = Consumer.create({
  queueUrl: config.AWS_SQS.scraperQueueURL,
  handleMessage: (message, done) => {
    const $message = JSON.parse(message.Body);
    logger.info(`ScrapperQueuePoller: Message Received ${$message.url}`);
    done();
  },
});

ScrapeQueuePoller.on('error', (err) => {
  logger.info(`ScrapperQueuePoller: Error Polling Queue ${err}`);
});

export default ScrapeQueuePoller;
