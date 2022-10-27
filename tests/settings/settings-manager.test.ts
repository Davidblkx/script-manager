import { assertEquals } from "deno/testing/asserts.ts";
import { mock } from "../mock.ts";
import { ISettingsValidation } from '../../src/modules/settings/models.ts';
import { SettingsManager } from '../../src/modules/settings/settings-manager.ts';
import type { ConfigFile } from "../../src/modules/config/config-file.ts";
import { LocalConfig, GlobalConfig } from "../../src/modules/config/model.ts";
import { logger, LogLevel } from '../../src/modules/logger.ts';

Deno.test('#SettingsManager', async settingsSteps => {

  const level = logger.logLevel;
  logger.setLogLevel(LogLevel.disabled);

  await settingsSteps.step('.getSetting', async getSteps => {

    await getSteps.step('get "local" by default', () => {
      const validator = mock<ISettingsValidation>({
        validateSetting: () => [true, '']
      }).get();

      const config = mock<LocalConfig>({
        settings: {
          foo: 'bar'
        }
      }).get();
      const localConfig = mock<ConfigFile<LocalConfig>>({ config }).get();

      const settings = new SettingsManager({
        validator,
        localConfig,
      });

      const result = settings.getSetting('foo');
      assertEquals(result, 'bar');
    });

    await getSteps.step('get defined target', () => {
      const validator = mock<ISettingsValidation>({
        validateSetting: () => [true, '']
      }).get();

      const config = mock<GlobalConfig>({
        settings: {
          foo: 'bar'
        }
      }).get();
      const globalConfig = mock<ConfigFile<GlobalConfig>>({ config }).get();

      const settings = new SettingsManager({
        validator,
        globalConfig,
      });

      const result = settings.getSetting('foo', 'global');
      assertEquals(result, 'bar');
    });

    await getSteps.step('get target by id', () => {
      const validator = mock<ISettingsValidation>({
        validateSetting: () => [true, '']
      }).get();

      const config = mock<LocalConfig>({
        targets: {
          main: {
            id: 'main',
            settings: { foo: 'bar' },
            name: 'main'
          }
        },
        settings: {
          foo: 'baz'
        }
      }).get();
      const localConfig = mock<ConfigFile<LocalConfig>>({ config }).get();

      const settings = new SettingsManager({
        validator,
        localConfig,
      });

      const result = settings.getSetting('foo', 'target', 'main');
      assertEquals(result, 'bar');
    });

  });

  await settingsSteps.step('.setSetting', async setSteps => {

    await setSteps.step('set "local" by default', async () => {
      const validator = mock<ISettingsValidation>({
        validateSetting: () => [true, '']
      }).get();

      const config = mock<LocalConfig>({
        settings: { foo: 'bar' }
      }).get();

      const localConfig = mock<ConfigFile<LocalConfig>>({ config })
        .stub('save', () => Promise.resolve()).get();

      const settings = new SettingsManager({
        validator,
        localConfig,
      });

      await settings.setSetting('foo', 'baz');
      assertEquals(config.settings.foo, 'baz');
    });

    await setSteps.step('set defined target', async () => {
      const validator = mock<ISettingsValidation>({
        validateSetting: () => [true, '']
      }).get();

      const config = mock<GlobalConfig>({
        settings: { foo: 'bar' }
      }).get();

      const globalConfig = mock<ConfigFile<GlobalConfig>>({ config })
        .stub('save', () => Promise.resolve()).get();

      const settings = new SettingsManager({
        validator,
        globalConfig,
      });

      await settings.setSetting('foo', 'baz', 'global');
      assertEquals(config.settings.foo, 'baz');
    });

    await setSteps.step('set target by id', async () => {
      const validator = mock<ISettingsValidation>({
        validateSetting: () => [true, '']
      }).get();

      const config = mock<LocalConfig>({
        targets: {
          main: {
            id: 'main',
            settings: { foo: 'bar' },
            name: 'main'
          }
        },
        settings: {
          foo: 'baz'
        }
      }).get();

      const localConfig = mock<ConfigFile<LocalConfig>>({ config })
        .stub('save', () => Promise.resolve()).get();

      const settings = new SettingsManager({
        validator,
        localConfig,
      });

      await settings.setSetting('foo', 'qux', 'target', 'main');
      assertEquals(config.targets.main.settings.foo, 'qux');
    });

    await setSteps.step('save changes', async () => {
      const validator = mock<ISettingsValidation>({
        validateSetting: () => [true, '']
      }).get();

      const config = mock<LocalConfig>({
        settings: { foo: 'bar' }
      }).get();

      const localConfig = mock<ConfigFile<LocalConfig>>({ config })
        .stub('save', () => Promise.resolve());

      const settings = new SettingsManager({
        validator,
        localConfig: localConfig.get(),
      });

      await settings.setSetting('foo', 'baz');
      localConfig.assertWasCalled('save');
    });

    await setSteps.step('validate setting', async () => {
      const validator = mock<ISettingsValidation>({
        validateSetting: () => [true, '']
      });

      const config = mock<LocalConfig>({
        settings: { foo: 'bar' }
      }).get();

      const localConfig = mock<ConfigFile<LocalConfig>>({ config })
        .stub('save', () => Promise.resolve()).get();

      const settings = new SettingsManager({
        validator: validator.get(),
        localConfig,
      });

      await settings.setSetting('foo', 'baz');
      validator.assertWasCalled('validateSetting');
    });

    await setSteps.step('don\'t save on validation fail', async () => {
      const validator = mock<ISettingsValidation>({
        validateSetting: () => [false, '']
      });

      const config = mock<LocalConfig>({
        settings: { foo: 'bar' }
      }).get();

      const localConfig = mock<ConfigFile<LocalConfig>>({ config })
        .stub('save', () => Promise.resolve());

      const settings = new SettingsManager({
        validator: validator.get(),
        localConfig: localConfig.get(),
      });

      await settings.setSetting('foo', 'baz');
      localConfig.assertWasCalled('save', 0);
    });

  });

  await settingsSteps.step('.deleteSetting', async deleteSteps => {

    await deleteSteps.step('delete "local" by default', async () => {
      const validator = mock<ISettingsValidation>({
        validateSetting: () => [true, '']
      }).get();

      const config = mock<LocalConfig>({
        settings: { foo: 'bar' }
      }).get();

      const localConfig = mock<ConfigFile<LocalConfig>>({ config })
        .stub('save', () => Promise.resolve()).get();

      const settings = new SettingsManager({
        validator,
        localConfig,
      });

      await settings.deleteSetting('foo');
      assertEquals(config.settings.foo, undefined);
    });

    await deleteSteps.step('delete defined target', async () => {
      const validator = mock<ISettingsValidation>({
        validateSetting: () => [true, '']
      }).get();

      const config = mock<GlobalConfig>({
        settings: { foo: 'bar' }
      }).get();

      const globalConfig = mock<ConfigFile<GlobalConfig>>({ config })
        .stub('save', () => Promise.resolve()).get();

      const settings = new SettingsManager({
        validator,
        globalConfig,
      });

      await settings.deleteSetting('foo', 'global');
      assertEquals(config.settings.foo, undefined);
    });

    await deleteSteps.step('delete target by id', async () => {
      const validator = mock<ISettingsValidation>({
        validateSetting: () => [true, '']
      }).get();

      const config = mock<LocalConfig>({
        targets: {
          main: {
            id: 'main',
            settings: { foo: 'bar' },
            name: 'main'
          }
        },
        settings: {
          foo: 'baz'
        }
      }).get();

      const localConfig = mock<ConfigFile<LocalConfig>>({ config })
        .stub('save', () => Promise.resolve()).get();

      const settings = new SettingsManager({
        validator,
        localConfig,
      });

      await settings.deleteSetting('foo', 'target', 'main');
      assertEquals(config.targets.main.settings.foo, undefined);
    });

    await deleteSteps.step('save changes', async () => {
      const validator = mock<ISettingsValidation>({
        validateSetting: () => [true, '']
      }).get();

      const config = mock<LocalConfig>({
        settings: { foo: 'bar' }
      }).get();

      const localConfig = mock<ConfigFile<LocalConfig>>({ config })
      .stub('save', () => Promise.resolve());

      const settings = new SettingsManager({
        validator,
        localConfig: localConfig.get(),
      });

      await settings.deleteSetting('foo');
      localConfig.assertWasCalled('save');
    });

  });

  logger.setLogLevel(level);

});
