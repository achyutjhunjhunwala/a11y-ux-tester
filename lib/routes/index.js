import { Router } from 'express';
import scrapeMarkets from './scrape-markets';

const routes = new Router();

routes.use('/', scrapeMarkets);

routes.get('/', (req, res) => {
  res.json({
    hello: 'world',
  });
});

export default routes;
