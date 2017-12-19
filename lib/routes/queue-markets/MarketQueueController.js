import uuid from 'uuid/v1';
import logger from '../../utils/logger';
import MarketQueue from '../../services/queues/MarketQueue';
import config from '../../config';


export default class MarketQueueController {
  constructor() {
    this.MarketQueue = MarketQueue;
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


    this.MarketQueue
      .sendMessage(params, (err, job) => {
        if (err) {
          logger.info(`MarketQueueController: job failed adding to scraper queue with job id: ${job.MessageId}`);
        } else {
          logger.info(`MarketQueueController: job added to scraper queue with job id: ${job.MessageId}`);
        }
      });
  }
}
