import logger from '../../utils/logger';

const getLuminance = (rgb) => {
  const $rgb = rgb;

  for (let i = 0; i < $rgb.length; i += 1) {
    if ($rgb[i] <= 0.03928) {
      $rgb[i] /= 12.92;
    } else {
      $rgb[i] = (($rgb[i] + 0.055) / 1.055) ** 2.4;
    }
  }
  const l = (0.2126 * $rgb[0]) + (0.7152 * $rgb[1]) + (0.0722 * $rgb[2]);
  logger.info(`Color Contrast Calculator: getLuminance - ${l}`);
  return l;
};

const contrastCalculator = (textColor, imageColour) => {
  let ratio = 1;
  const l1 = getLuminance([textColor.r / 255, textColor.g / 255, textColor.b / 255]);
  const l2 = getLuminance([imageColour.r / 255, imageColour.g / 255, imageColour.b / 255]);
  if (l1 >= l2) {
    ratio = (l1 + 0.05) / (l2 + 0.05);
  } else {
    ratio = (l2 + 0.05) / (l1 + 0.05);
  }
  ratio = Math.round(ratio * 100) / 100; // round to 2 decimal places
  const aa = ratio >= 4.5 ? 'Passed' : 'Failed';
  const aaPlus = ratio >= 3 ? 'Passed' : 'Failed';
  const aaa = ratio >= 7 ? 'Passed' : 'Failed';
  const aaaPlus = ratio >= 4.5 ? 'Passed' : 'Failed';

  return {
    aa, aaPlus, aaa, aaaPlus,
  };
};

const getTextAreaColor = (rgb) => {
  const parts = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  delete parts[0];
  return { r: parseInt(parts[1], 10), g: parseInt(parts[2], 10), b: parseInt(parts[3], 10) };
};

const getAccessibility = (list) => {
  const results = [];

  list.forEach((item) => {
    item.textAreaDimensions.forEach((textNode) => {
      const rgb = getTextAreaColor(textNode.rgb);
      let $textNode = textNode;
      $textNode = Object.assign({}, rgb, textNode);
      const result = contrastCalculator($textNode, $textNode.bgColor);
      results
        .push({
          text: textNode.text,
          tag: textNode.tagName,
          result,
        });
    });
  });

  return results;
};

export default getAccessibility;
