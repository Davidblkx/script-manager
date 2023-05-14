import type { Logger, ILoggerFactory } from "../logger/mod.ts";
import type { RawConfig, IParser } from "./model.ts";

export class Parser implements IParser {
  #logger: Logger;

  constructor(loggerFactory: ILoggerFactory) {
    this.#logger = loggerFactory.get("ssh:parser");
  }

  parse(data: string): RawConfig[] {
    const regex = /^(?<prop> *)(?<key>.*?) (?<value>.*)$/gm;
    const result: RawConfig[] = [];

    const matches = data.matchAll(regex);
    let config: RawConfig | undefined;
    const dumpConfig = () => {
      if (config) {
        result.push(config);
        config = undefined;
      }
    };

    for (const match of matches) {
      const { prop, key, value } = match.groups!;
      const isProp = prop.length > 0;

      if (!isProp || key === "Host") {
        dumpConfig();

        config = {
          match: value.trim(),
          props: {},
        };
      } else if (config) {
        config.props[key.trim()] = value.trim();
      } else {
        this.#logger.warning(`Unexpected ssh host property: ${key} ${value}`);
        continue;
      }
    }
    dumpConfig();

    return result;
  }

  stringify(config: RawConfig[]): string {
    let result = "";

    for (const { match, props } of config) {
      result += `Host ${match}\n`;
      Object.entries(props).forEach(([key, value]) => {
        result += `    ${key} ${value}\n`;
      });
      result += "\n";
    }

    return result;
  }
}
