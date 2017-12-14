const config = {
  CACHE_TTL: parseInt(process.env.APP_CACHE_TTL, 10) || 300000, // In milliseconds
  AWS_SQS: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.REGION || 'eu-west-1',
    scraperQueueURL: 'https://sqs.eu-west-1.amazonaws.com/665962130261/sentinel-a11y-market-scraper-queue',
  },
};

module.exports = config;
