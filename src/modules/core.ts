export type Action = 'sync' | 'save' | 'clean' | 'status' | 'new' | 'download' | 'upload' | 'init' | 'update';

export interface UnitConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  type: 'core' | 'module';
  settings: Record<string, string>;
}

export interface TargetConfig {
  id: string;
  name: string;
  settings: Record<string, string>;
}

export interface SMXConfig {
  targets: TargetConfig[];
  units: UnitConfig[];
  default: string;
  editor: string[];
  folder: string;
  version: string;
}
