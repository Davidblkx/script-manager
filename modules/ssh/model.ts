export type RawConfig = {
  match: string;
  props: Record<string, string | undefined>;
};

export type Property =
  | "HostName"
  | "User"
  | "IdentityFile"
  | "Port"
  | "LogLevel"
  | "Compression";

export interface IConfig {
  readonly path: URL;

  getHost(match: string): IHost;
  getHosts(): Readonly<Record<string, IHost>>;

  hasMatch(match: string): boolean;

  update(): Promise<void>;
}

export interface IHost {
  match: string;

  getProperty(name: Property | string): string | undefined;
  setProperty(name: Property | string, value: string | undefined): void;

  entries(): Readonly<Record<string, string | undefined>>;
}

export interface IParser {
  parse(data: string): RawConfig[];
  stringify(config: RawConfig[]): string;
}

export interface ISecureShell {
  readonly parser: IParser;

  loadConfig(path: URL): Promise<IConfig>;
  loadUserConfig(): Promise<IConfig>;
}
