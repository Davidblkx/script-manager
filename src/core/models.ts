export type Action = 'sync' | 'save' | 'clean' | 'status' | 'new' | 'download' | 'upload' | 'init' | 'update';

export interface UnitConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  type: 'core' | 'module';
  settings: Record<string, string>;
  hooks: string[];
}

export interface TargetConfig {
  id: string;
  name: string;
  settings: Record<string, string>;
}

export interface SMXConfig {
  targets: Record<string, TargetConfig>;
  units: Record<string, UnitConfig>;
  default: string;
  editor: string[];
  folder: string;
  version: string;
}
