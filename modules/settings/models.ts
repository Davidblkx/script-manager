export type SettingTarget = 'windows' | 'darwin' | 'linux';

export type SettingValue = string | number | boolean;

export interface SettingRecord {
  key: string;
  value: string;
  priority: number;
  target?: SettingTarget;
}

export interface SettingSingle<T extends SettingValue> {
  key: string;
  default: T;
  array: false;
  domain: string;
}

export interface SettingArray<T extends SettingValue> {
  key: string;
  default: T[];
  array: true;
  domain: string;
}

export type Setting<T extends SettingValue> = SettingSingle<T> | SettingArray<T>;

export interface SettingsSource {
  readonly name: string;

  read(key: string): SettingRecord | undefined;
  write(record: SettingRecord): void;
  delete(key: string): void;

  save(): Promise<void>;
}
