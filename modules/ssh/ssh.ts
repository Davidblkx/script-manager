import { join } from "$deno/path/mod.ts";
import type { ISecureShell, IParser, IConfig } from "./model.ts";
import type { Logger, ILoggerFactory } from "../logger/mod.ts";
import type { IFileSystem } from "../file-system/mod.ts";
import {
  IConfigProvider,
  IConfigHandler,
  Config,
  defaultParser,
} from "../config/mod.ts";
import { SSHConfig } from "./config.ts";
import { Parser } from "./parser.ts";

const PathConfig: Config<string> = {
  domain: "smx",
  key: "ssh.path",
  defaultValue: "~/.ssh",
  parser: defaultParser(""),
  description: "The path to the .ssh folder",
};

const FileConfig: Config<string> = {
  domain: "smx",
  key: "ssh.config",
  defaultValue: "config",
  parser: defaultParser(""),
  description: "The name of the ssh config file",
};

export class SecureShell implements ISecureShell {
  parser: IParser;
  #logger: Logger;
  #logFactory: ILoggerFactory;
  #config: IConfigHandler;
  #fs: IFileSystem;

  constructor(
    configProvider: IConfigProvider,
    configHandler: IConfigHandler,
    loggerFactory: ILoggerFactory,
    fileSystem: IFileSystem
  ) {
    this.#logger = loggerFactory.get("ssh");
    this.#logFactory = loggerFactory;
    this.parser = new Parser(loggerFactory);
    this.#fs = fileSystem;
    this.#config = configHandler;

    configProvider.declare(PathConfig);
    configProvider.declare(FileConfig);
  }

  async loadConfig(path: URL): Promise<IConfig> {
    this.#logger.debug(`Loading ssh config: ${path}`);
    const file = await this.#fs.get(path).toFile();
    const config = new SSHConfig(this.#logFactory, file, this.parser);
    await config.load();
    return config;
  }

  async loadUserConfig(): Promise<IConfig> {
    const path = this.#config.read(PathConfig);
    const config = this.#config.read(FileConfig);

    const configPath = join(path, config);
    this.#logger.debug(`Loading ssh config: ${configPath}`);

    const file = await this.#fs.get(configPath).toFile();
    const sshConfig = new SSHConfig(this.#logFactory, file, this.parser);
    await sshConfig.load();
    return sshConfig;
  }
}
