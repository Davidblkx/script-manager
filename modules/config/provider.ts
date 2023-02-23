import type { IConfigProvider, Config } from './models.ts';

export class ConfigProvider implements IConfigProvider {
  #configs = new Set<Config<unknown>>();

  declare<T>(config: Config<T>): void {
    this.#configs.add(config);
  }

  search<T>(key: string, domain = 'smx'): Config<T> | undefined {
    for (const config of this.#configs) {
      if (config.key === key && config.domain === domain) {
        return config as Config<T>;
      }
    }

    return undefined;
  }

  domain(domain: string): Config<unknown>[] {
    const res = [];

    for (const config of this.#configs) {
      if (config.domain === domain) {
        res.push(config);
      }
    }

    return res;
  }
}
