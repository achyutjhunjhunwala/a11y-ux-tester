import { Router } from 'express';
import bodyParser from 'body-parser';
import { validationResult } from 'express-validator/check';
import { matchedData } from 'express-validator/filter';

import logger from '../../utils/logger';
import marketUrlValidation from './MarketUrlValidation';
import MarketQueueController from './MarketQueueController';

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

  const { list, resolution } = matchedData(req);
  const marketQueueController = new MarketQueueController();

  logger.info('Route:queue-markets, search criteria received: %j', list);

  try {
    list.forEach((market) => {
      marketQueueController
        .scrape({
          market,
          resolution,
        });
    });
    res.json();
  } catch (err) {
    next(err);
  }
});

export default queueMarkets;
