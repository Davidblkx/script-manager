export const TARGET_NAME = '__TARGET_PATH';

export type JsonValue = string | number | boolean | undefined | null;
export type SettingValue = JsonValue | JsonValue[];

export type EditorContext = 'file' | 'folder' | 'diff';

export type SettingsObject = Record<string, SettingValue>;

export interface UnitConfig {
  id: string;
  enabled: boolean;
  type: 'core' | 'module';
}

export interface TargetConfig {
  id: string;
  name: string;
  settings: SettingsObject;
}

export interface EditorConfig {
  context: EditorContext | EditorContext[];
  args: string[];
  targetAlias?: string;
}

export interface BaseConfig {
  settings: SettingsObject;
  version: string;
}

export interface PathConfig {
  path: string;
}

export interface GlobalConfig extends BaseConfig, PathConfig { }

export interface LocalConfig extends BaseConfig {
  editors: Record<string, EditorConfig>;
  targets: Record<string, TargetConfig>;
  units: Record<string, UnitConfig>;
}
