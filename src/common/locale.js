function get_t_locale_iso8601({ utc, locale } = {}) {
  const t_locale_iso8601 = new Intl.DateTimeFormat(locale || "en-us", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h24",
    timeZone: utc && "UTC",
  });

  t_locale_iso8601.toString = function (date) {
    const parts = t_locale_iso8601.formatToParts(date).reduce((car, cdr) => {
      car[cdr.type] = cdr.value;
      return car;
    }, {});
    return `${parts.year}${parts.month}${parts.day}T${parts.hour}${parts.minute}${parts.second}`;
  };
  return t_locale_iso8601;
}

export { get_t_locale_iso8601 };
