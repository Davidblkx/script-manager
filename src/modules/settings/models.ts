export type PropValue = string | number | boolean | undefined | null;
export type JsonValue = PropValue | PropValue[];

export interface OSValue {
  value: JsonValue;
  windows?: JsonValue;
  linux?: JsonValue;
  darwin?: JsonValue;
}

export type SettingValue = OSValue | JsonValue;

export type SettingTarget = 'global' | 'local' | 'target';

export type TargetOrder = [SettingTarget, SettingTarget, SettingTarget];

export interface SettingUnit {
  key: string;
  value: Readonly<JsonValue>;
  target: SettingTarget;
  OS: keyof OSValue | 'none';
}

export type JsonSettings = Record<string, JsonValue>;

export function isOSValue(e: unknown): e is OSValue {
  return typeof e === 'object' && e !== null && 'value' in e;
}
