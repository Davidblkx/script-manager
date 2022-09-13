export type RuntimeType = 'deno' | 'pwsh' | 'fish' | 'bash'

export interface RuntimeConfig {
  type: RuntimeType;
  sync: boolean;
  import: boolean;
  enabled: boolean;
}

export interface RuntimeHandler {
  type: RuntimeType;
  setConfig(config: RuntimeConfig): void;
  init(): void;
  sync(): Promise<void>;
  import(): Promise<void>;
  disable(): Promise<void>;
  enable(): Promise<void>;
  clean(): Promise<void>;
}

export interface SMXConfig {
  engines: RuntimeConfig[];
  repo: string;
  global: boolean;
  dotFiles: string[];
}
