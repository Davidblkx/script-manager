import { assertEquals } from "deno/testing/asserts.ts";
import type { ISection, ISettingsManager } from '../../../src/modules/settings.ts';
import type { IDirHandler } from "../../../src/modules/infra/dir-handler.ts";
import { mock, fn, mockAll } from "../../mock.ts";
import { logger, LogLevel } from '../../../src/modules/logger.ts';

import { Target } from "../../../src/modules/targets.ts";

Deno.test('#Target', async targetSteps => {

  const level = logger.logLevel;
  logger.setLogLevel(LogLevel.disabled);

  await targetSteps.step('.init', async initSteps => {
    await initSteps.step('creates target folder', async () => {
      const settingsMock = mockAll<ISettingsManager>();
      const dirHandlerMock = mock<IDirHandler>()
        .stub('create', () => Promise.resolve(true));
      const targetConfig = {
        id: 'target-id',
        name: 'target-name',
        settings: {},
      }

      const target = new Target(settingsMock.get(), targetConfig, dirHandlerMock.get(), () => Promise.resolve());

      await target.init(false);

      dirHandlerMock.assertWasCalled('create');
    });

    await initSteps.step('when setDefault is deactivated, don\'t save', async () => {
      const settingsMock = mockAll<ISettingsManager>();
      const dirHandlerMock = mock<IDirHandler>()
        .stub('create', () => Promise.resolve(true));

      const targetConfig = {
        id: 'target-id',
        name: 'target-name',
        settings: {},
      }

      const target = new Target(settingsMock.get(), targetConfig, dirHandlerMock.get(), () => Promise.resolve());

      await target.init(false);

      settingsMock.assertWasCalled('set', 0);
    });

    await initSteps.step('when setDefault is activated, save setting', async () => {
      const sectionMock = mock<ISection>()
        .stub('set', () => Promise.resolve());
      const settingsMock = mockAll<ISettingsManager>()
        .stub('section', <T>() => sectionMock.get() as unknown as T);
      const dirHandlerMock = mock<IDirHandler>()
        .stub('create', () => Promise.resolve(true));
      const targetConfig = {
        id: 'target-id',
        name: 'target-name',
        settings: {},
      }

      const target = new Target(settingsMock.get(), targetConfig, dirHandlerMock.get(), () => Promise.resolve());

      await target.init(true);

      sectionMock.assertWasCalled('set');
    });
  });

  await targetSteps.step('.reset', async resetSteps => {
    await resetSteps.step('when type is all', async resetStepsAll => {
      await resetStepsAll.step('deletes settings', async () => {
        const settingsMock = mockAll<ISettingsManager>()
          .stub('set', () => Promise.resolve(true));
        const dirHandlerMock = mock<IDirHandler>()
          .stub('empty', () => Promise.resolve(true));
        const targetConfig = {
          id: 'target-id',
          name: 'target-name',
          settings: {
            p: 'v',
          },
        }
        const save = fn();

        const target = new Target(settingsMock.get(), targetConfig, dirHandlerMock.get(), save);

        await target.reset('all');

        assertEquals(0, Object.keys(targetConfig.settings).length);
      });

      await resetStepsAll.step('save changes', async () => {
        const settingsMock = mockAll<ISettingsManager>()
          .stub('set', () => Promise.resolve(true));
        const dirHandlerMock = mock<IDirHandler>()
          .stub('empty', () => Promise.resolve(true));
        const targetConfig = {
          id: 'target-id',
          name: 'target-name',
          settings: {
            p: 'v',
          },
        }
        const save = fn();

        const target = new Target(settingsMock.get(), targetConfig, dirHandlerMock.get(), save);

        await target.reset('all');

        save.assertWasCalled();
      });

      await resetStepsAll.step('clean target folder', async () => {
        const settingsMock = mockAll<ISettingsManager>()
          .stub('set', () => Promise.resolve(true));
        const dirHandlerMock = mock<IDirHandler>()
          .stub('empty', () => Promise.resolve(true));
        const targetConfig = {
          id: 'target-id',
          name: 'target-name',
          settings: {},
        }
        const save = fn();

        const target = new Target(settingsMock.get(), targetConfig, dirHandlerMock.get(), save);

        await target.reset('all');

        dirHandlerMock.assertWasCalled('empty');
      });
    });

    await resetSteps.step('when type is settings', async resetStepsSettings => {
      await resetStepsSettings.step('deletes settings', async () => {
        const settingsMock = mockAll<ISettingsManager>()
          .stub('set', () => Promise.resolve(true));
        const dirHandlerMock = mock<IDirHandler>()
          .stub('empty', () => Promise.resolve(true));
        const targetConfig = {
          id: 'target-id',
          name: 'target-name',
          settings: {
            p: 'v',
          },
        }
        const save = fn();

        const target = new Target(settingsMock.get(), targetConfig, dirHandlerMock.get(), save);

        await target.reset('settings');

        assertEquals(0, Object.keys(targetConfig.settings).length);
      });

      await resetStepsSettings.step('save changes', async () => {
        const settingsMock = mockAll<ISettingsManager>()
          .stub('set', () => Promise.resolve(true));
        const dirHandlerMock = mock<IDirHandler>()
          .stub('empty', () => Promise.resolve(true));
        const targetConfig = {
          id: 'target-id',
          name: 'target-name',
          settings: {
            p: 'v',
          },
        }
        const save = fn();

        const target = new Target(settingsMock.get(), targetConfig, dirHandlerMock.get(), save);

        await target.reset('settings');

        save.assertWasCalled();
      });

      await resetStepsSettings.step('don\'t clean target folder', async () => {
        const settingsMock = mockAll<ISettingsManager>()
          .stub('set', () => Promise.resolve(true));
        const dirHandlerMock = mock<IDirHandler>()
          .stub('empty', () => Promise.resolve(true));
        const targetConfig = {
          id: 'target-id',
          name: 'target-name',
          settings: {},
        }
        const save = fn();

        const target = new Target(settingsMock.get(), targetConfig, dirHandlerMock.get(), save);

        await target.reset('settings');

        dirHandlerMock.assertWasCalled('empty', 0);
      });
    });

    await resetSteps.step('when type is content', async resetStepsData => {
      await resetStepsData.step('don\'t delete settings', async () => {
        const settingsMock = mockAll<ISettingsManager>()
          .stub('set', () => Promise.resolve(true));
        const dirHandlerMock = mock<IDirHandler>()
          .stub('empty', () => Promise.resolve(true));
        const targetConfig = {
          id: 'target-id',
          name: 'target-name',
          settings: {
            p: 'v',
          },
        }
        const save = fn();

        const target = new Target(settingsMock.get(), targetConfig, dirHandlerMock.get(), save);

        await target.reset('content');

        assertEquals(1, Object.keys(targetConfig.settings).length);
      });

      await resetStepsData.step('don\'t save changes', async () => {
        const settingsMock = mockAll<ISettingsManager>()
          .stub('set', () => Promise.resolve(true));
        const dirHandlerMock = mock<IDirHandler>()
          .stub('empty', () => Promise.resolve(true));
        const targetConfig = {
          id: 'target-id',
          name: 'target-name',
          settings: {
            p: 'v',
          },
        }
        const save = fn();

        const target = new Target(settingsMock.get(), targetConfig, dirHandlerMock.get(), save);

        await target.reset('content');

        save.assertWasCalled(0);
      });

      await resetStepsData.step('clean target folder', async () => {
        const settingsMock = mockAll<ISettingsManager>()
          .stub('set', () => Promise.resolve(true));
        const dirHandlerMock = mock<IDirHandler>()
          .stub('empty', () => Promise.resolve(true));
        const targetConfig = {
          id: 'target-id',
          name: 'target-name',
          settings: {},
        }
        const save = fn();

        const target = new Target(settingsMock.get(), targetConfig, dirHandlerMock.get(), save);

        await target.reset('content');

        dirHandlerMock.assertWasCalled('empty');
      });
    });
  });

  await targetSteps.step('.setDefault', async setDefaultSteps => {
    await setDefaultSteps.step('set id as default value', async () => {
      const sectionMock = mock<ISection>()
        .stub('set', () => Promise.resolve());
      const settingsMock = mockAll<ISettingsManager>()
        .stub('section', <T>() => sectionMock.get() as unknown as T);
      const dirHandler = mock<IDirHandler>().get();
      const targetConfig = {
        id: 'target-id',
        name: 'target-name',
        settings: {},
      }

      const target = new Target(settingsMock.get(), targetConfig, dirHandler, () => Promise.resolve());

      await target.setDefault();

      sectionMock.assertWasCalledWith('set', "targets.default", targetConfig.id);
    });
  });

  await targetSteps.step('.delete', async deleteSteps => {
    await deleteSteps.step('delete folder', async () => {
      const settingsMock = mockAll<ISettingsManager>()
        .stub('set', () => Promise.resolve(true));
      const dirHandlerMock = mock<IDirHandler>()
        .stub('delete', () => Promise.resolve(true));
      const targetConfig = {
        id: 'target-id',
        name: 'target-name',
        settings: {},
      }

      const target = new Target(settingsMock.get(), targetConfig, dirHandlerMock.get(), () => Promise.resolve());

      await target.delete();

      dirHandlerMock.assertWasCalled('delete');
    });
  });

  await targetSteps.step('.setName', async setNameStep => {
    await setNameStep.step('changes the name', async () => {
      const settingsMock = mockAll<ISettingsManager>()
        .stub('set', () => Promise.resolve(true));
      const dirHandler = mock<IDirHandler>().get();
      const targetConfig = {
        id: 'target-id',
        name: 'target-name',
        settings: {},
      }

      const target = new Target(settingsMock.get(), targetConfig, dirHandler, () => Promise.resolve());

      await target.setName('new-name');

      assertEquals('new-name', targetConfig.name);
    });

    await setNameStep.step('save changes', async () => {
      const settingsMock = mockAll<ISettingsManager>()
        .stub('set', () => Promise.resolve(true));
      const dirHandlerMock = mock<IDirHandler>()
        .stub('empty', () => Promise.resolve(true));
      const targetConfig = {
        id: 'target-id',
        name: 'target-name',
        settings: {
          p: 'v',
        },
      }
      const save = fn();

      const target = new Target(settingsMock.get(), targetConfig, dirHandlerMock.get(), save);

      await target.setName('new-name');

      save.assertWasCalled();
    });
  });

  logger.setLogLevel(level);

});
