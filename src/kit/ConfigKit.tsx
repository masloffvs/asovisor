import * as toml from "toml";
import * as fs from "fs";
import _ from "lodash";

export default class ConfigKit {
  getConfig() {
    return toml.parse(String(fs.readFileSync(process.cwd() + "/config.toml")));
  }

  getProp(prop: string) {
    return _.get(this.getConfig(), prop);
  }
}

export const $configKit = new ConfigKit();
