export type RuntimeType = 'deno' | 'pwsh' | 'fish' | 'bash'

export interface RuntimeConfig {
  type: RuntimeType;
  sync: boolean;
  import: boolean;
  enabled: boolean;
}

export interface RuntimeHandler {
  readonly type: RuntimeType;
  readonly config: Readonly<RuntimeConfig>;

  setConfig(config: RuntimeConfig): void;
  init(): Promise<boolean>;
  sync(): Promise<boolean>;
  import(): Promise<boolean>;
  disable(): Promise<boolean>;
  enable(): Promise<boolean>;
  clean(): Promise<boolean>;
}

export interface SMXConfig {
  engines: RuntimeConfig[];
  repo: string;
  global: boolean;
  dotFiles: string[];
  editor: string;
}
