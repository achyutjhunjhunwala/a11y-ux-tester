import { Router } from 'express';
import queueMarkets from './queue-markets';

const routes = new Router();

routes.use('/', queueMarkets);

routes.get('/', (req, res) => {
  res.json({
    hello: 'world',
  });
});

export default routes;
