import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";

/**
 * Returns date as readable string. If date is empty, returns current date.
 * @param date
 * @param withTime
 * @param language
 * @returns
 */
export const getDate = (
  date?: Date | string,
  withTime?: boolean,
  language?: string
) => {
  const lang = language ? language : "en";
  dayjs.extend(LocalizedFormat);
  dayjs.locale(lang);
  if (withTime) return dayjs(date).format("L - LT");
  return dayjs(date).format("L");
};

export const isDate = (date: Date | string) => {
  return dayjs(date).isValid();
};
