import type { ISettingsValidation, SettingDefinition, SettingValueType } from './models.ts';
import { SettingValue } from "../config/model.ts";
import { logger } from '../logger.ts';
import { INTERNAL_SETTINGS } from './builtin-validations.ts';

export class SettingsValidation implements ISettingsValidation {
  #definitions: Map<string, SettingDefinition> = new Map();

  constructor(def: SettingDefinition[] = []) {
    def.forEach(d => this.#definitions.set(d.key, d));
  }

  validateSetting(key: string, value: SettingValue): [boolean, string] {
    const definition = this.#definitions.get(key);
    if (!definition) {
      logger.debug(`No definition found for setting ${key}`);
      return [true, ''];
    }

    if (Array.isArray(value) && (definition.array === false || definition.array === undefined)) {
      logger.error(`Setting ${key} is cannot be an array`);
      return [false, 'array is not allowed'];
    }

    if (!Array.isArray(value) && definition.array === 'force') {
      logger.error(`Setting ${key} must be an array`);
      return [false, 'array is required'];
    }

    if (Array.isArray(value)) {
      const valRes = this.#validateArray(value, definition.types);
      if (!valRes[0]) {
        logger.error(`Setting ${key} is not a valid array: ${valRes[1]}`);
      }
      return valRes;
    } else {
      const valRes = this.#validateAnyTypes(value, Array.isArray(definition.types) ? definition.types : [definition.types]);
      if (!valRes[0]) {
        logger.error(`Setting ${key} is not a valid ${valRes[1]}`);
      }
      return valRes;
    }
  }

  addDefinition(definition: SettingDefinition): void {
    this.#definitions.set(definition.key, definition);
  }

  #validateType(value: SettingValue, types: SettingValueType): [boolean, string] {
    switch (types) {
      case 'string': return [typeof value === 'string', 'string'];
      case 'number': return [typeof value === 'number', 'number'];
      case 'boolean': return [typeof value === 'boolean', 'boolean'];
      case 'undefined': return [typeof value === 'undefined', 'undefined'];
      case 'null': return [value === null, 'null'];
    }
  }

  #validateAnyTypes(value: SettingValue, types: SettingValueType[]): [boolean, string] {
    const validations = types.map(t => this.#validateType(value, t));
    const valid = validations.find(v => v[0]);
    if (valid) { return valid; }

    return [false, validations.filter(v => !v[0]).map(v => v[1]).join(', ')];
  }

  #validateArray(value: SettingValue, types: SettingValueType | SettingValueType[]): [boolean, string] {
    if (!Array.isArray(value)) {
      return [false, 'not an array'];
    }

    const validations = value.map(v => this.#validateAnyTypes(v, Array.isArray(types) ? types : [types]));
    const isValid = validations.filter(v => v[0]).length === value.length;
    if (isValid) { return [true, '']; }

    const index = validations.findIndex(v => !v[0]);
    const typeName = validations[index][1];
    return [false, `index ${index} is not a ${typeName}`];
  }

  public static buildDefault(): SettingsValidation {
    return new SettingsValidation(INTERNAL_SETTINGS);
  }
}
