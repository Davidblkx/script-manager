import { IFileHandler } from '../../../src/modules/infra/file-handler.ts';
import { ConfigFile } from '../../../src/modules/config/config-file.ts';
import { BaseConfig } from '../../../src/modules/config/model.ts';
import { mockAll } from '../../mock.ts';
import { logger, LogLevel } from '../../../src/modules/logger.ts';

Deno.test('#ConfigFile', async configSteps => {

  const level = logger.logLevel;
  logger.setLogLevel(LogLevel.disabled);

  await configSteps.step('.init', async initSteps => {
    await initSteps.step('reads the file', async () => {
      const handler = mockAll<IFileHandler>();
      const initialConfig = {} as BaseConfig;

      const file = new ConfigFile({ path: ['', 'folder'], initialConfig, fileFactory: () => handler.get() });

      await file.init();

      handler.assertWasCalled('readJsonFile');
    });

    await initSteps.step('updates the file', async () => {
      const handler = mockAll<IFileHandler>();
      const initialConfig = {} as BaseConfig;

      const file = new ConfigFile({ path: ['', 'folder'], initialConfig, fileFactory: () => handler.get() });

      await file.init();

      handler.assertWasCalled('writeJsonFile');
    });

    await initSteps.step('merge config files', async () => {
      const currentConfig: BaseConfig = {
        settings: {
          foo: 'bar',
          same: 'current',
        },
        version: '1.0.0',
      }

      const handler = mockAll<IFileHandler>()
        // deno-lint-ignore no-explicit-any
        .stub('readJsonFile', () => Promise.resolve(currentConfig as any))
      const initialConfig: BaseConfig = {
        settings: {
          bar: 'foo',
          same: 'initial',
        },
        version: '2.0.0',
      }

      const file = new ConfigFile({ path: ['', 'folder'], initialConfig, fileFactory: () => handler.get() });

      await file.init();

      handler.assertWasCalledWith('writeJsonFile', {
        settings: {
          foo: 'bar',
          bar: 'foo',
          same: 'current',
        },
        version: '2.0.0',
      });
    });
  })

  await configSteps.step('.save', async saveSteps => {
    await saveSteps.step('writes the file', async () => {
      const handler = mockAll<IFileHandler>();
      const initialConfig = {} as BaseConfig;

      const file = new ConfigFile({ path: ['', 'folder'], initialConfig, fileFactory: () => handler.get() });

      await file.save();

      handler.assertWasCalled('writeJsonFile');
    });
  });

  await configSteps.step('.reload', async reloadSteps => {
    await reloadSteps.step('reads the file', async () => {
      const handler = mockAll<IFileHandler>();
      const initialConfig = {} as BaseConfig;

      const file = new ConfigFile({ path: ['', 'folder'], initialConfig, fileFactory: () => handler.get() });

      await file.reload();

      handler.assertWasCalled('readJsonFile');
    });
  });

  await configSteps.step('.setConfig', async setConfig => {
    await setConfig.step('writes the file with new config', async () => {
      const handler = mockAll<IFileHandler>();
      const initialConfig = { p: 1 } as unknown as BaseConfig;

      const file = new ConfigFile({ path: ['', 'folder'], initialConfig, fileFactory: () => handler.get() });

      await file.setConfig({ p: 2 } as unknown as BaseConfig);

      handler.assertWasCalledWith('writeJsonFile', { p: 2 });
    });
  });

  logger.setLogLevel(level);
});
