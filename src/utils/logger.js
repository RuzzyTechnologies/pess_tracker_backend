const dayjs = require("dayjs");
const pino = require("pino");

const log = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    }
  },
  base: {
    pid: false,
  },
  timestamp: () => `"time": "${dayjs().format()}"`,
});


module.exports = log;