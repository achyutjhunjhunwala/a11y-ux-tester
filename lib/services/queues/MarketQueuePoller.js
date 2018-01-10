import Consumer from 'sqs-consumer';
import logger from '../../utils/logger';
import config from '../../config';
import MarketScrapper from './../scrape-markets/scrapeMarkets';
import { getAccessibility, getResultsPercentage, getOverallResult } from '../core-services/color-contrast-calculator';

const MarketQueuePoller = Consumer.create({
  queueUrl: config.AWS_SQS.scraperQueueURL,
  handleMessage: (message, done) => {
    const $message = JSON.parse(message.Body);
    logger.info(`MarketQueuePoller: Message Received ${$message.url}`);
    new MarketScrapper($message).getTextDetails()
      .then((list) => {
        logger.info(`MarketQueuePoller: Scrapped Text Data for ${$message.url}`);
        logger.info(`MarketQueuePoller: Started Computing Accessibility Results for ${$message.url}`);

        const results = getAccessibility(list, { resolution: `${$message.x}*${$message.y}` });
        const percentageResults = getResultsPercentage(results);

        logger.info(`MarketQueuePoller: Calculate Accessibility Results in % for ${$message.url}`);

        const status = getOverallResult(percentageResults);
        logger.info(`MarketQueuePoller: Calculate Overall Status for computed results for ${$message.url}`);

        const testResult = {
          url: $message.url,
          resolution: `${$message.x}*${$message.y}`,
          result: percentageResults,
          status: status ? 'failed' : 'passed',
        };

        logger.info(`MarketQueuePoller: Finished Computing Accessibility Results for ${$message.url}`);
        logger.info(testResult);
      });
    done();
  },
});

MarketQueuePoller.on('error', (err) => {
  logger.info(`MarketQueuePoller: Error Polling Queue ${err}`);
});

export default MarketQueuePoller;
