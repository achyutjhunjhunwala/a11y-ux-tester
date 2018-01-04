/* global document */

import Chromeless from 'chromeless';
import logger from '../../utils/logger';

class MarketScrapper {
  constructor(url) {
    this.url = url;
  }

  async getTextDetails() {
    const chromeless = new Chromeless();
    let scrappedData;

    logger.info(`ScrapeMarkets: Starting Chromeless for ${this.url}`);
    try {
      scrappedData = await chromeless
        .goto(this.url)
        .wait('.teaser_texts___36cqp')
        .inject('js', 'https://cdnjs.cloudflare.com/ajax/libs/color-thief/2.0.1/color-thief.min.js')
        .evaluate(() => {
          const scrappedObj = [].map.call(
            document.querySelectorAll('.masthead_carousel_container___LWjjU .item_wrapper____hiLu'),
            (a) => {
              const data = {
                picture: {},
                nodeText: [],
              };
              const picture = a.querySelector('picture');
              const textNode = a.querySelectorAll('.main___2rWwT > div > div');
              data.picture.className = picture.classList.value;
              data.picture.offsetLeft = picture.offsetLeft;
              data.picture.offsetTop = picture.offsetTop;

              textNode.forEach((node) => {
                if (node.innerText.length) {
                  const { tagName } = node.children[0].children[0];
                  const tag = node.children[0].children[0];
                  if (tagName === 'H1' || tagName === 'P') {
                    data.nodeText.push({
                      text: node.innerText,
                      tagName,
                      height: tag.offsetHeight,
                      width: tag.offsetWidth,
                      left: tag.offsetLeft,
                      top: tag.offsetTop,
                    });
                  }
                }
              });
              return data;
            },
          );
          return scrappedObj;
        });
    } catch (e) {
      logger.info(e);
      throw new Error(e);
    }
    await chromeless.end();
    logger.info(`ScrapeMarkets: Chromeless execution completed for ${this.url}`);
    return scrappedData;
  }
}

export default MarketScrapper;

// {
//   title: a.innerText,
//     href: a.href,
//   className: a.classList.value,
//   attr: a.attributes.manual_cm_sp.value,
//   color: window.getComputedStyle(a).color,
// }
