/* global document, window */

import Chromeless from 'chromeless';
import logger from '../../utils/logger';

class MarketScrapper {
  constructor(url) {
    this.url = url;
  }

  async getTextDetails() {
    const chromeless = new Chromeless();
    let cta;

    logger.info(`ScrapeMarkets: Starting Chromeless for ${this.url}`);
    try {
      cta = await chromeless
        .goto(this.url)
        .wait('.teaser_texts___36cqp')
        .evaluate(() => {
          const links = [].map.call(
            document.querySelectorAll('.cta___rnmqS a'),
            a => ({
              title: a.innerText,
              href: a.href,
              className: a.classList.value,
              attr: a.attributes.manual_cm_sp.value,
              color: window.getComputedStyle(a).color,
            }),
          );
          return links;
        });
    } catch (e) {
      logger.info(e);
      throw new Error(e);
    }
    await chromeless.end();
    logger.info(`ScrapeMarkets: Chromeless execution completed for ${this.url}`);
    return cta;
  }
}

export default MarketScrapper;
