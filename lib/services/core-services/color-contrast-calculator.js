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
  const aa = ratio >= 3.5 ? 'Passed' : 'Failed';
  const aaPlus = ratio >= 2 ? 'Passed' : 'Failed';
  const aaa = ratio >= 5 ? 'Passed' : 'Failed';
  const aaaPlus = ratio >= 3.5 ? 'Passed' : 'Failed';

  return {
    aa, aaPlus, aaa, aaaPlus,
  };
};

const getTextAreaColor = (rgb) => {
  const parts = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  delete parts[0];
  return { r: parseInt(parts[1], 10), g: parseInt(parts[2], 10), b: parseInt(parts[3], 10) };
};

const getAccessibility = (list, resolution) => {
  const results = [];
  let validationArr = {};

  list.forEach((item) => {
    item.textAreaDimensions.forEach((textNode) => {
      const rgb = getTextAreaColor(textNode.rgb);
      const $textNode = Object.assign({}, rgb, textNode);
      const paletteArr = textNode.bgColor.palette;

      validationArr = {
        aaArr: { passed: 0, failed: 0 },
        aaPlusArr: { passed: 0, failed: 0 },
        aaaArr: { passed: 0, failed: 0 },
        aaaPlusArr: { passed: 0, failed: 0 },
      };

      for (let i = 0; i < paletteArr.length; i += 1) {
        const a11yResults = contrastCalculator($textNode, {
          r: paletteArr[i][0],
          g: paletteArr[i][1],
          b: paletteArr[i][2],
        });

        for (const a11yItem in a11yResults) {
          if ({}.hasOwnProperty.call(a11yResults, a11yItem)) {
            validationArr[`${a11yItem}Arr`][a11yResults[a11yItem].toLowerCase()] += 1;
          }
        }
      }

      results
        .push({
          text: textNode.text,
          tag: textNode.tagName,
          validationArr,
          ...resolution,
        });
    });
  });

  return results;
};

const calculatePercentage = (validationArr) => {
  const $validationPerc = validationArr;
  let failedCount = 0;

  Object.keys($validationPerc).forEach((key) => {
    const perc =
      ($validationPerc[key].passed / ($validationPerc[key].passed + $validationPerc[key].failed))
      * 100;
    $validationPerc[key].perc = perc;
    $validationPerc[key].result = perc >= 50 ? 'passed' : 'failed';
    if ($validationPerc[key].result === 'failed') {
      failedCount += 1;
    }
  });

  return failedCount > 2 ? 'failed' : 'passed';
};

/* eslint no-param-reassign: ["error", { "ignorePropertyModificationsFor": ["item"] }] */
const getResultsPercentage = (results) => {
  results.forEach((item) => {
    item.status = calculatePercentage(item.validationArr);
  });

  return results;
};

const getOverallResult = (percResult) => {
  const $percResult = percResult;

  return !!$percResult.filter(result => result.status === 'failed').length;
};

export {
  getAccessibility,
  getResultsPercentage,
  getOverallResult,
};
