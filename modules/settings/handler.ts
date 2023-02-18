import { ConvertMap, converters } from './convert.ts';
import type { Setting, SettingRecord } from './models.ts';

export interface SettingsOptions {
  converterMap?: ConvertMap;
}

export class SettingsHandler {
  #converters: ConvertMap;

  constructor({
    converterMap = converters,
  }: SettingsOptions = {}) {
    this.#converters = converterMap;
  }
}
