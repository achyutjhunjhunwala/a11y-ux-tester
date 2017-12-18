/* global document */

import puppeteer from 'puppeteer';
import logger from '../../utils/logger';

class MarketScrapper {
  constructor(url) {
    this.url = url;
  }

  async getTextDetails() {
    logger.info(`ScrapeMarkets: Creating Puppeteer Instance ${this.url}`);
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    let scrappedData = {};

    logger.info(`ScrapeMarkets: Starting Puppeteer for ${this.url}`);
    try {
      await page.goto(this.url);
      await page.addScriptTag({ url: 'https://code.jquery.com/jquery-3.2.1.min.js' });
      await page.addScriptTag({ url: 'https://cdnjs.cloudflare.com/ajax/libs/color-thief/2.0.1/color-thief.min.js' });
      await page.waitFor('[class=teaser_texts___36cqp]');
      scrappedData = await this.scrapeContent(page);
    } catch (e) {
      logger.info(`ScrapeMarkets: Exception from Puppeteer for ${this.url}`);
      logger.info(e);
      await browser.close();
    }

    await browser.close();
    logger.info(`ScrapeMarkets: Puppeteer execution completed for ${this.url}`);
    return scrappedData;
  }

  static someFn() {
    return 'Hello World';
  }

  async scrapeContent(page) {
    const { url } = this;
    logger.info(`ScrapeMarkets: Scraping Content started for ${url}`);
    const scrapedContent = await page.evaluate(() => [].map.call(
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
    ));
    return scrapedContent;
  }
}

export default MarketScrapper;
