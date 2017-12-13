import { Router } from 'express';
import bodyParser from 'body-parser';
import { validationResult } from 'express-validator/check';
import { matchedData } from 'express-validator/filter';

import logger from '../../utils/logger';
import marketUrlValidation from './MarketUrlValidation';
import ScrapeMarketController from './ScrapeMarketController';

const scrapeMarkets = new Router();
const jsonParser = bodyParser.json();

scrapeMarkets.post('/scrape-markets', [jsonParser, ...marketUrlValidation], (req, res, next) => {
  try {
    validationResult(req).throw();
  } catch (err) {
    logger.info('Route:scrape-markets, error %j', err.mapped());

    res.status(422).json({ errors: err.mapped() });
    return;
  }

  const searchMarkets = matchedData(req);
  const scrapeMarketController = new ScrapeMarketController();

  logger.info('Route:scrape-realestates, search criteria received: %j', searchMarkets);

  try {
    searchMarkets.url.forEach((market) => {
      scrapeMarketController
        .scrape({
          market,
        });
    });
    res.json();
  } catch (err) {
    next(err);
  }
});

export default scrapeMarkets;
