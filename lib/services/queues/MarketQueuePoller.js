import Consumer from 'sqs-consumer';
import logger from '../../utils/logger';
import config from '../../config';
import MarketScrapper from './../scrape-markets/scrapeMarkets';

const MarketQueuePoller = Consumer.create({
  queueUrl: config.AWS_SQS.scraperQueueURL,
  handleMessage: (message, done) => {
    const $message = JSON.parse(message.Body);
    logger.info(`MarketQueuePoller: Message Received ${$message.url}`);
    new MarketScrapper($message.url).getTextDetails()
      .then((list) => {
        logger.info(`MarketQueuePoller: Scrapped Text Data for ${$message.url}`);
        logger.info(list);
      });
    done();
  },
});

MarketQueuePoller.on('error', (err) => {
  logger.info(`MarketQueuePoller: Error Polling Queue ${err}`);
});

export default MarketQueuePoller;
