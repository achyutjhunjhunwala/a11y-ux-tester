import AWS from 'aws-sdk';
import logger from '../../utils/logger';
import config from '../../config';

AWS.config.update({ region: config.AWS_SQS.region });
logger.info('MarketQueue: Starting market queue');

// Create an SQS service object
const marketQueue = new AWS.SQS({ apiVersion: '2012-11-05' });

export default marketQueue;
