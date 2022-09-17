export type RuntimeType = 'deno' | 'pwsh' | 'fish' | 'bash'

export interface RuntimeConfig {
  type: RuntimeType;
  sync: boolean;
  enabled: boolean;
  plugin?: string;
  opt: Record<string, string>;
}

export interface RuntimeHandler {
  readonly type: RuntimeType;
  readonly config: Readonly<RuntimeConfig>;

  setConfig(config: RuntimeConfig): void;

  init(): Promise<boolean>;
  sync(): Promise<boolean>;
  save(): Promise<boolean>;
  disable(): Promise<boolean>;
  enable(): Promise<boolean>;
  clean(): Promise<boolean>;
  status(): Promise<'sync' | 'save' | 'clean'>;
  create(name: string): Promise<boolean>;
}

export interface SMXConfig {
  /** Engines configuration */
  engines: RuntimeConfig[];
  /** Folder to save scripts */
  repo: string;
  /** If true, bin folder is added to PATH */
  global: boolean;
  /** Editor to open scripts */
  editor: string;
}
