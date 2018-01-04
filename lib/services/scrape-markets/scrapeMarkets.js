/* global document window ColorThief $ */

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
      await page.addScriptTag({ url: 'https://unpkg.com/color-thief@2.2.1/js/color-thief.js' });
      await page.waitFor('[class=teaser_texts___36cqp]');
      await this.instantiateHelpers(page);
      scrappedData = await this.scrapeContent(page);
    } catch (e) {
      logger.info(`ScrapeMarkets: Exception from Puppeteer for ${this.url}`);
      logger.info(e);
      // await browser.close();
    }

    await browser.close();
    logger.info(`ScrapeMarkets: Puppeteer execution completed for ${this.url}`);
    return scrappedData;
  }

  async instantiateHelpers(page) {
    const instance = await page.evaluate(() => {
      window.delay = t => new Promise((resolve) => {
        setTimeout(resolve, t);
      });

      window.getTextAreaDimensions = (textNode, picture) => {
        const textData = [];

        textNode.forEach((node) => {
          if (node.innerText.length) {
            const { tagName } = node.children[0].children[0];
            const tag = node.children[0].children[0];
            if (tagName === 'H1' || tagName === 'P') {
              textData.push({
                text: node.innerText,
                tagName,
                h: tag.offsetHeight,
                w: tag.offsetWidth,
                left: tag.offsetLeft,
                top: tag.offsetTop,
                x: tag.offsetLeft - picture.offsetLeft,
                y: tag.offsetTop - picture.offsetTop,
                rgb: window.getComputedStyle(tag).color,
              });
            }
          }
        });

        return textData;
      };

      window.getAverageColourAsRGB = async (sourceImage, textArea) => {
        const colorThief = new ColorThief();

        await window.delay(100);

        const palette = colorThief.getPalette(sourceImage, 8, 1, false);
        const result = colorThief.getColor(sourceImage, 1, textArea);
        const rgb = { r: result[0], g: result[1], b: result[2] };

        rgb.css = `rgb(${rgb.r},${rgb.g},${rgb.b})`;
        rgb.palette = palette;
        return rgb;
      };
    });

    return instance;
  }

  async scrapeContent(page) {
    const { url } = this;
    logger.info(`ScrapeMarkets: Scraping Content started for ${url}`);
    const scrapedContent = await page.evaluate(async () => {
      const elements = document.querySelectorAll('.masthead_carousel_container___LWjjU .item_wrapper____hiLu');
      const elementsArr = Array.prototype.slice.call(elements);

      // Dirty fix to avoid 2 dummy elements created by Carousel
      elementsArr.shift();
      elementsArr.shift();
      const results = [];

      for (const a of elementsArr) {
        const data = {
          picture: {},
          textAreaDimensions: [],
        };
        const picture = a.querySelector('picture');
        const $picture = $(a).find('picture img')[0];
        $picture.crossOrigin = 'anonymous';
        $picture.src = `http://0.0.0.0:8081/${$picture.src}`;
        const textNode = a.querySelectorAll('.main___2rWwT > div > div');

        // data.picture.className = picture.classList.value;
        data.picture.offsetLeft = picture.offsetLeft;
        data.picture.offsetTop = picture.offsetTop;

        data.textAreaDimensions = window.getTextAreaDimensions(textNode, data.picture);

        for (const item of data.textAreaDimensions) {
          const $bgColor = await window.getAverageColourAsRGB($picture, item);
          item.bgColor = $bgColor;
        }

        results.push(data);
      }

      return results;
    });
    return scrapedContent;
  }
}

export default MarketScrapper;
