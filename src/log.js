import Pino from "pino";

const log = new Pino({
  level: "trace",
  formatters: {
    level(label, number) {
      return { level: label };
    },
  },
  timestamp: Pino.stdTimeFunctions.isoTime,
  base: { pid: process.pid }
});

export { log };
