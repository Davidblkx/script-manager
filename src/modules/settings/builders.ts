import type { ISettingsManager } from "./manager.ts";
import type { JsonSettings } from "./models.ts";

export function createSection<T extends JsonSettings>() {
  return (manager: ISettingsManager) => manager.section<T>();
}

export function createKeys<T extends JsonSettings>() {
  return <K extends keyof T>(key: K) => key;
}
