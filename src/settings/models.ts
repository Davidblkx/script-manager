import { SettingValue } from "../config/model.ts";

export type SettingTarget = 'global' | 'local' | 'target';

export interface ISettingsManager {
  getSetting(key: string): SettingValue;
  getSetting(key: string, target: SettingTarget): SettingValue;
  getSetting(key: string, target: 'target', targetId: string): SettingValue

  setSetting(key: string, value: SettingValue): Promise<boolean>
  setSetting(key: string, value: SettingValue, target: SettingTarget): Promise<boolean>
  setSetting(key: string, value: SettingValue, target: 'local', targetId: string): Promise<boolean>

  deleteSetting(key: string): Promise<boolean>
  deleteSetting(key: string, target: SettingTarget): Promise<boolean>
  deleteSetting(key: string, target: 'local', targetId: string): Promise<boolean>
}

export interface ISettingsValidation {
  validateSetting(key: string, value: SettingValue): [boolean, string];
  addDefinition(definition: SettingDefinition): void;
}

export type SettingValueType = 'string' | 'number' | 'boolean' | 'undefined' | 'null';

export interface SettingDefinition {
  key: string;
  types: SettingValueType | SettingValueType[];
  array?: false | 'force' | 'optional';
}
