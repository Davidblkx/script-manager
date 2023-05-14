import type { IConfig, IHost, RawConfig, IParser } from "./model.ts";
import type { Logger, ILoggerFactory } from "../logger/mod.ts";
import type { IFile } from "../file-system/mod.ts";

export class SSHConfig implements IConfig {
  #logger: Logger;
  #file: IFile;
  #hosts: Record<string, SSHConfigHost> = {};
  #parser: IParser;

  get path(): URL {
    return this.#file.path;
  }

  constructor(loggerFactory: ILoggerFactory, file: IFile, parser: IParser) {
    this.#logger = loggerFactory.get("ssh:config");
    this.#file = file;
    this.#parser = parser;
  }

  getHost(match: string): IHost {
    let host = this.#hosts[match];

    if (!host) {
      host = new SSHConfigHost({ match, props: {} });
      this.#hosts[match] = host;
    }

    return host;
  }

  getHosts(): Readonly<Record<string, IHost>> {
    return this.#hosts;
  }

  hasMatch(match: string): boolean {
    return this.#hosts[match] !== undefined;
  }

  async update(): Promise<void> {
    this.#logger.debug(`Updating ssh config: ${this.#file.path}`);
    const data = this.#parser.stringify(
      Object.values(this.#hosts).map((host) => host.raw)
    );
    await this.#file.write(data);
  }

  async load(): Promise<void> {
    this.#logger.debug(`Loading ssh config: ${this.#file.path}`);
    const data = await this.#file.read();
    const configs = this.#parser.parse(data);
    this.#hosts = configs.reduce((hosts, config) => {
      hosts[config.match] = new SSHConfigHost(config);
      return hosts;
    }, {} as Record<string, SSHConfigHost>);
  }
}

export class SSHConfigHost implements IHost {
  #config: RawConfig;

  get raw(): RawConfig {
    return this.#config;
  }

  get match(): string {
    return this.#config.match;
  }

  constructor(config: RawConfig) {
    this.#config = config;
  }

  getProperty(name: string): string | undefined {
    return this.#config.props[name];
  }

  setProperty(name: string, value: string | undefined): void {
    this.#config.props[name] = value;
  }

  entries(): Readonly<Record<string, string | undefined>> {
    return this.#config.props;
  }
}
