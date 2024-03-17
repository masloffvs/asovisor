import pino from "pino";
import "pino-pretty";

class LoggerKit {
  getLogger() {
    return pino({
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
        },
      },
    });
  }
}

export const $loggerKit = new LoggerKit();

export default LoggerKit;
