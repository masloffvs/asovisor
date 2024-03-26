import schedule from "node-schedule";
import { $loggerKit } from "./src/kit/LoggerKit";
import { $indexatorKit } from "./src/kit/IndexatorKit";

$loggerKit.getLogger().info("Hello! I am a service for ASOVizor.pw");

$indexatorKit.indexEverything();

schedule.scheduleJob("0 0 * * *", function () {
  $indexatorKit.indexEverything();
});


