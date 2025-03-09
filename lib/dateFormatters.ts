import { DateTime } from "luxon";

export const formatDateToLocaleTime = (date: string, locale: string) =>
  DateTime.fromISO(date).setLocale(locale).toLocaleString(DateTime.TIME_SIMPLE);

export const formatDateToLocaleString = (date: string, locale: string) =>
  DateTime.fromISO(date).setLocale(locale).toLocaleString(DateTime.DATETIME_MED);
