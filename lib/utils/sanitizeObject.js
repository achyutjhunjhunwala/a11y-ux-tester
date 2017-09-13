/**
 * Parses the JSON and remove key, if `undefined`
 *
 * @param  {object} obj
 *
 * @return {object} The parsed JSON
 */
export default obj => JSON.parse(JSON.stringify(obj));
