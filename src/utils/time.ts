import { format, toDate, utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";

export const DEFAULT_DATETIME_FORMAT = "yyyy-MM-dd HH:mm:ssxxx";

export const HUMAN_READABLE_DATETIME_FORMAT =
  "EEEE, LLLL do, yyyy 'at' h:mm aaaa OOOO";

export const DEFAULT_DATE_FORMAT = "yyyy-MM-dd";

export const HUMAN_READABLE_DATE_FORMAT = "EEEE, LLLL do, yyyy";

export const CALENDAR_DATE_FORMAT = "yyyy-MM-dd'T'HH:mm";

export const convertToTimezone = (
  date?: string,
  timezoneB?: string,
  syntax?: string
): string => {
  if(!date || !timezoneB) {
    return ""
  }
  const utc = toDate(date);
  return format(
    utcToZonedTime(utc, timezoneB),
    syntax ?? DEFAULT_DATETIME_FORMAT,
    {
      timeZone: timezoneB,
    }
  );
};
