import express from 'express';
import morgan from 'morgan';

import logger from './utils/logger';
import routes from './routes';
import ScrapeQueuePoller from './services/queues/ScraperQueuePoller';

const app = express();

logger.info('Overriding Express logger');
app.use(morgan('combined', { stream: logger.stream }));

// Connect all our routes to our application
app.use('/', routes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  logger.info(`-> localhost:${PORT}`);
  logger.info('-> Starting Polling SQS for Messages');
  ScrapeQueuePoller.start();
});
