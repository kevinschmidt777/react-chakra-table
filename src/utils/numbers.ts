/**
 * Returns a number with thousand-seperator and comma (language correct) rounded at second number after comma.
 * @param number
 * @param language
 * @returns
 */
export const numberFormatter = (number: any, language?: string) => {
  const lang = language ? language : "en";
  const intNumber = parseFloat(number);
  const roundTwoDecimals = intNumber.toFixed(2);
  return new Intl.NumberFormat(lang).format(parseFloat(roundTwoDecimals));
};
