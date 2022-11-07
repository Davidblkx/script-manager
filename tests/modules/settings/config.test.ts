import { mock } from '../../mock.ts';
import { SettingsConfig } from "../../../src/modules/settings/config.ts";
import { ConfigFile } from "../../../src/modules/config/config-file.ts";
import { GlobalConfig, SettingsObject } from '../../../src/modules/config.ts';
import { assertEquals } from "deno/testing/asserts.ts";

Deno.test('#SettingsConfig', async steps => {
  await steps.step('return settings object', () => {
    const configFile = mock<ConfigFile<GlobalConfig>>().get();
    const mockSettings = { p: 'q' } as unknown as SettingsObject;

    const config = new SettingsConfig({
      configFile,
      getObj: () => mockSettings
    });

    assertEquals(config.global, mockSettings);
  });

  await steps.step('get setting', () => {
    const configFile = mock<ConfigFile<GlobalConfig>>().get();
    const mockSettings = { p: 'q' } as unknown as SettingsObject;

    const config = new SettingsConfig({
      configFile,
      getObj: () => mockSettings
    });

    assertEquals(config.get('p'), 'q');
  });

  await steps.step('set setting', () => {
    const configFile = mock<ConfigFile<GlobalConfig>>().get();
    const mockSettings = { p: 'q' } as unknown as SettingsObject;

    const config = new SettingsConfig({
      configFile,
      getObj: () => mockSettings
    });

    config.set('p', 'r');
    assertEquals(config.get('p'), 'r');
  });

  await steps.step('delete setting', () => {
    const configFile = mock<ConfigFile<GlobalConfig>>().get();
    const mockSettings = { p: 'q' } as unknown as SettingsObject;

    const config = new SettingsConfig({
      configFile,
      getObj: () => mockSettings
    });

    config.del('p');
    assertEquals(config.get('p'), undefined);
  });

  await steps.step('check if setting exists', () => {
    const configFile = mock<ConfigFile<GlobalConfig>>().get();
    const mockSettings = { p: 'q' } as unknown as SettingsObject;

    const config = new SettingsConfig({
      configFile,
      getObj: () => mockSettings
    });

    assertEquals(config.has('p'), true);
  });

  await steps.step('check if settings doesn\'t exist', () => {
    const configFile = mock<ConfigFile<GlobalConfig>>().get();
    const mockSettings = { p: 'q' } as unknown as SettingsObject;

    const config = new SettingsConfig({
      configFile,
      getObj: () => mockSettings
    });

    assertEquals(config.has('q'), false);
  });

  await steps.step('save settings', async () => {
    const mockConfigFile = mock<ConfigFile<GlobalConfig>>()
      .stub('save', () => Promise.resolve())
    const mockSettings = { p: 'q' } as unknown as SettingsObject;

    const config = new SettingsConfig({
      configFile: mockConfigFile.get(),
      getObj: () => mockSettings
    });

    config.set('p', 'r');
    await config.save();

    mockConfigFile.assertWasCalled('save');
  });
});
