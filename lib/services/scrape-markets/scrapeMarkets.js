/* global window document MMCQ $ */

import puppeteer from 'puppeteer';
import logger from '../../utils/logger';

class MarketScrapper {
  constructor(message) {
    this.url = message.url;
    this.x = message.x || 800;
    this.y = message.y || 640;
  }

  async getTextDetails() {
    logger.info(`ScrapeMarkets: Creating Puppeteer Instance ${this.url}`);

    // process.setMaxListeners(Infinity); // <== Important line

    const resolution = {
      x: this.x,
      y: this.y,
    };

    // const args = [
    //   '--disable-gpu',
    //   `--window-size=${resolution.x},${resolution.y}`,
    //   '--no-sandbox',
    //   '--disable-setuid-sandbox',
    //   '--disable-dev-shm-usage',
    // ];

    // While running the code locally uncomment below code and comment Line 40

    // const browser = await puppeteer.launch({
    //   headless: true,
    //   handleSIGINT: false,
    //   args,
    // });

    // Always uncomment below line before committing code to Develop and comment the above 2
    // const blocks

    let browser = await puppeteer.connect({ browserWSEndpoint: 'ws://chrome:3000' });
    logger.info('Calling this once');

    const page = await browser.newPage();
    logger.info('Calling newPage once');

    await page.setViewport({
      width: resolution.x,
      height: resolution.y,
    });

    browser.on('targetcreated', () => {
      logger.info('New Page Created');
    });

    let scrappedData = {};

    logger.info(`ScrapeMarkets: Starting Puppeteer for ${this.url}`);

    // page.on('console', msg => console.log('PAGE LOG:', ...msg.args));

    try {
      await page.goto(this.url, { waitUntil: 'networkidle2' });
      await page.addScriptTag({ url: 'https://code.jquery.com/jquery-3.2.1.min.js' });
      await page.addScriptTag({ url: 'https://cdn.jsdelivr.net/npm/quantize@1.0.2/quantize.min.js' });
      await this.instantiateHelpers(page);
      scrappedData = await this.scrapeContent(page);
    } catch (e) {
      logger.info(`ScrapeMarkets: Exception from Puppeteer for ${this.url}`);
      logger.info(e);
      await page.close();
      await browser.close();
      browser = null;
    }

    const pages = await browser.pages();
    logger.info(`Pages : ${pages.length}`);
    await page.close();
    await browser.close();
    browser = null;
    logger.info(`ScrapeMarkets: Puppeteer execution completed for ${this.url}`);
    logger.info(`Again Pages : ${pages.length}`);
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

      window.sourceImage = [];

      window.getAverageColourAsRGB = async (sourceImage, textArea) => {
        await window.delay(1000);

        window.textArea = textArea;
        const palette = window.getPalette(sourceImage, 3, 1, textArea);
        const result = window.getColor(sourceImage, 1, textArea);
        const rgb = { r: result[0], g: result[1], b: result[2] };

        rgb.css = `rgb(${rgb.r},${rgb.g},${rgb.b})`;
        rgb.palette = palette;
        return rgb;
      };

      // Creating Color thief functions here as the original implementation has custom version of
      // library which returns dominant color around the text and not dominant color from the
      // whole image

      /*
        CanvasImage Class
        Class that wraps the html image element and canvas.
        It also simplifies some of the canvas context manipulation
        with a set of helper functions.
      */
      window.CanvasImage = class CanvasImage {
        constructor(image, textArea) {
          this.canvas = document.createElement('canvas');
          this.context = this.canvas.getContext('2d');
          this.textArea = textArea;

          document.body.appendChild(this.canvas);

          this.width = this.canvas.width = image.width;
          this.height = this.canvas.height = image.height;

          this.context.drawImage(image, 0, 0, this.width, this.height);
        }

        getPixelCount() {
          return this.width * this.height;
        }

        getImageData() {
          return this.context
            .getImageData(this.textArea.x, this.textArea.y, this.textArea.w, this.textArea.h);
        }

        removeCanvas() {
          this.canvas.parentNode.removeChild(this.canvas);
        }
      };

      window.getColor = (sourceImage, quality, textArea) => {
        const palette = window.getPalette(sourceImage, 3, quality, textArea);
        const dominantColor = palette ? palette[0] : null;
        return dominantColor;
      };

      window.getPalette = (sourceImage, colorCount, quality, textArea) => {
        // Create custom CanvasImage object
        const image = new window.CanvasImage(sourceImage, textArea);
        const imageData = image.getImageData();
        const pixels = imageData.data;
        const pixelCount = image.getPixelCount();

        // Store the RGB values in an array format suitable for quantize function
        const pixelArray = [];
        for (let i = 0, offset, r, g, b, a; i < pixelCount; i += quality) {
          offset = i * 4;
          r = pixels[offset + 0];
          g = pixels[offset + 1];
          b = pixels[offset + 2];
          a = pixels[offset + 3];
          // If pixel is mostly opaque and not white
          if (a >= 125) {
            if (!(r > 250 && g > 250 && b > 250)) {
              pixelArray.push([r, g, b]);
            }
          }
        }

        // Send array to quantize function which clusters values
        // using median cut algorithm
        const cmap = MMCQ.quantize(pixelArray, colorCount);
        const palette = cmap ? cmap.palette() : null;

        // Clean up
        image.removeCanvas();

        return palette;
      };
    });

    return instance;
  }

  async scrapeContent(page) {
    const { url } = this;
    logger.info(`ScrapeMarkets: Scraping Content started for ${url}`);
    const scrapedContent = await page.evaluate(async () => {
      const results = [];
      const masthead = document.querySelector('[class*="masthead_carousel_container"]');
      const itemWrapper = masthead.querySelectorAll('[class*="item_wrapper"]');
      const elementsArr = Array.prototype.slice.call(itemWrapper);

      // Dirty fix to avoid 2 dummy elements created by Carousel
      if (elementsArr && elementsArr.length) {
        elementsArr.shift();
        elementsArr.shift();
      }

      for (const a of elementsArr) {
        const data = {
          picture: {},
          textAreaDimensions: [],
        };
        const picture = a.querySelector('picture');
        const $picture = $(a).find('picture img')[0];
        $picture.crossOrigin = 'anonymous';
        $picture.src = `http://0.0.0.0:8081/${$picture.src}`;
        const mainNode = a.querySelector('[class*="main___"]');
        const textNode = mainNode.querySelectorAll(':scope > div > div');

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
