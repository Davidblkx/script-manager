import { assertEquals } from "deno/testing/asserts.ts";
import { SettingsValidation } from '../../src/settings/settings-validation.ts';
import { logger, LogLevel } from '../../src/logger.ts';

Deno.test('#SettingsValidation', async settingsSteps => {

  await settingsSteps.step('.validateSetting', async validateSteps => {

    const level = logger.logLevel;
    logger.setLogLevel(LogLevel.disabled);

    await validateSteps.step('defaults to valid', () => {
      const validator = new SettingsValidation();
      const [valid] = validator.validateSetting('foo', 'bar');
      assertEquals(valid, true);
    });

    await validateSteps.step('validates string', () => {
      const validator = new SettingsValidation([{ key: 'foo', types: 'string' }]);
      const [valid] = validator.validateSetting('foo', 'bar');
      assertEquals(valid, true);
    });

    await validateSteps.step('validates not string', () => {
      const validator = new SettingsValidation([{ key: 'foo', types: 'string' }]);
      const [valid] = validator.validateSetting('foo', 123);
      assertEquals(valid, false);
    });

    await validateSteps.step('validates number', () => {
      const validator = new SettingsValidation([{ key: 'foo', types: 'number' }]);
      const [valid] = validator.validateSetting('foo', 1);
      assertEquals(valid, true);
    });

    await validateSteps.step('validates not number', () => {
      const validator = new SettingsValidation([{ key: 'foo', types: 'number' }]);
      const [valid] = validator.validateSetting('foo', 'bar');
      assertEquals(valid, false);
    });

    await validateSteps.step('validates boolean', () => {
      const validator = new SettingsValidation([{ key: 'foo', types: 'boolean' }]);
      const [valid] = validator.validateSetting('foo', true);
      assertEquals(valid, true);
    });

    await validateSteps.step('validates not boolean', () => {
      const validator = new SettingsValidation([{ key: 'foo', types: 'boolean' }]);
      const [valid] = validator.validateSetting('foo', 'bar');
      assertEquals(valid, false);
    });

    await validateSteps.step('validates undefined', () => {
      const validator = new SettingsValidation([{ key: 'foo', types: 'undefined' }]);
      const [valid] = validator.validateSetting('foo', undefined);
      assertEquals(valid, true);
    });

    await validateSteps.step('validates not undefined', () => {
      const validator = new SettingsValidation([{ key: 'foo', types: 'undefined' }]);
      const [valid] = validator.validateSetting('foo', 'bar');
      assertEquals(valid, false);
    });

    await validateSteps.step('validates null', () => {
      const validator = new SettingsValidation([{ key: 'foo', types: 'null' }]);
      const [valid] = validator.validateSetting('foo', null);
      assertEquals(valid, true);
    });

    await validateSteps.step('validates not null', () => {
      const validator = new SettingsValidation([{ key: 'foo', types: 'null' }]);
      const [valid] = validator.validateSetting('foo', 'bar');
      assertEquals(valid, false);
    });

    await validateSteps.step('validates array', () => {
      const validator = new SettingsValidation([{ key: 'foo', types: 'string', array: 'force' }]);
      const [valid] = validator.validateSetting('foo', ['bar', 'aer']);
      assertEquals(valid, true);
    });

    await validateSteps.step('validates not array', () => {
      const validator = new SettingsValidation([{ key: 'foo', types: 'string' }]);
      const [valid] = validator.validateSetting('foo', ['bar']);
      assertEquals(valid, false);
    });

    await validateSteps.step('validates multiple types', () => {
      const validator = new SettingsValidation([{ key: 'foo', types: ['string', 'number'] }]);
      const [valid] = validator.validateSetting('foo', 1);
      const [valid2] = validator.validateSetting('foo', 'bar');
      assertEquals(valid, true);
      assertEquals(valid2, true);
    });

    await validateSteps.step('validates multiple types not', () => {
      const validator = new SettingsValidation([{ key: 'foo', types: ['string', 'number'] }]);
      const [valid] = validator.validateSetting('foo', true);
      assertEquals(valid, false);
    });

    await validateSteps.step('validates multiple types with array', () => {
      const validator = new SettingsValidation([{ key: 'foo', types: ['string', 'number'], array: 'force' }]);
      const [valid] = validator.validateSetting('foo', [1, 2, 'asd']);
      assertEquals(valid, true);
    });

    await validateSteps.step('validates multiple types with array not', () => {
      const validator = new SettingsValidation([{ key: 'foo', types: ['string', 'number'], array: 'force' }]);
      const [valid] = validator.validateSetting('foo', [1, 2, true]);
      assertEquals(valid, false);
    });

    await validateSteps.step('validates empty array', () => {
      const validator = new SettingsValidation([{ key: 'foo', types: 'string', array: 'force' }]);
      const [valid] = validator.validateSetting('foo', []);
      assertEquals(valid, true);
    });

    await validateSteps.step('validates force array', () => {
      const validator = new SettingsValidation([{ key: 'foo', types: 'string', array: 'force' }]);
      const [valid] = validator.validateSetting('foo', 'bar');
      assertEquals(valid, false);
    });

    await validateSteps.step('validates optional array', () => {
      const validator = new SettingsValidation([{ key: 'foo', types: 'string', array: 'optional' }]);
      const [valid] = validator.validateSetting('foo', 'bar');
      assertEquals(valid, true);
    });

    logger.setLogLevel(level);
  });

});
