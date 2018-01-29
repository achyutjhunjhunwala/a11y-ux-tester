import { Router } from 'express';
import bodyParser from 'body-parser';
import { validationResult } from 'express-validator/check';
import { matchedData } from 'express-validator/filter';

import logger from '../../utils/logger';
import marketUrlValidation from './MarketUrlValidation';

import MarketScrapper from './../../services/scrape-markets/scrapeMarkets';
import {
  getAccessibility, getOverallResult,
  getResultsPercentage,
} from '../../services/core-services/color-contrast-calculator';

const queueMarkets = new Router();
const jsonParser = bodyParser.json();

queueMarkets.post('/queue-markets', [jsonParser, ...marketUrlValidation], (req, res, next) => {
  try {
    validationResult(req).throw();
  } catch (err) {
    logger.info('Route:queue-markets, error %j', err.mapped());

    res.status(422).json({ errors: err.mapped() });
    return;
  }

  const { url, resolution } = matchedData(req);

  logger.info('Route:queue-markets, search criteria received: %j', url);

  try {
    new MarketScrapper({ url, resolution }).getTextDetails()
      .then((list) => {
        if (list && list.length) {
          logger.info(`MarketQueuePoller: Scrapped Text Data for ${url}`);
          logger.info(`MarketQueuePoller: Started Computing Accessibility Results for ${url}`);

          const results = getAccessibility(list, { resolution: `${resolution.x}*${resolution.y}` });
          const percentageResults = getResultsPercentage(results);

          logger.info(`MarketQueuePoller: Calculate Accessibility Results in % for ${url}`);

          const status = getOverallResult(percentageResults);
          logger.info(`MarketQueuePoller: Calculate Overall Status for computed results for ${url}`);

          const testResult = {
            url,
            resolution: `${resolution.x}*${resolution.y}`,
            result: percentageResults,
            status: status ? 'failed' : 'passed',
          };

          logger.info(`MarketQueuePoller: Finished Computing Accessibility Results for ${url}`);
          logger.info(testResult);

          logger.info('MarketQueuePoller: Waiting for Next Request');

          res.json(testResult);
        } else {
          logger.info(`MarketQueuePoller: Could not find Selector on Page for ${url}`);
          res.json({ status: 'Could not find Selector on Page' });
        }
      });
  } catch (err) {
    logger.info(`MarketQueuePoller: Something stupid happened for ${url}`);
    next(err);
  }
});

export default queueMarkets;
