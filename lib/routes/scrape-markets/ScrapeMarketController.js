import uuid from 'uuid/v1';
import logger from '../../utils/logger';
import ScraperQueue from '../../services/queues/ScraperQueue';
import config from '../../config';


export default class ScrapeMarketController {
  constructor() {
    this.ScraperQueue = ScraperQueue;
  }

  scrape({
    market,
  }) {
    const params = {
      DelaySeconds: 10,
      MessageAttributes: {
        id: {
          DataType: 'String',
          StringValue: uuid(),
        },
        Author: {
          DataType: 'String',
          StringValue: 'Achyut Jhunjhunwala',
        },
      },
      MessageBody: JSON.stringify(market),
      QueueUrl: config.AWS_SQS.scraperQueueURL,
    };


    this.ScraperQueue
      .sendMessage(params, (err, job) => {
        if (err) {
          logger.info(`ScrapeMarketController: job failed adding to scraper queue with job id: ${job.MessageId}`);
        } else {
          logger.info(`ScrapeMarketController: job added to scraper queue with job id: ${job.MessageId}`);
        }
      });
  }
}
