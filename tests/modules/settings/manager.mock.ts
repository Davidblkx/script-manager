// deno-lint-ignore-file no-explicit-any
import { mock } from '../../mock.ts';
import { GlobalConfigFile } from "../../../src/modules/config/global-config.ts";
import { LocalConfigFile } from "../../../src/modules/config/local-config.ts";
import { SettingsManager } from "../../../src/modules/settings.ts";

export function buildMockSettingsManager(
  {
    globalSettings = {},
    localSettings = {},
    targetSettings = {},
  }: {
    globalSettings?: Record<string, unknown>;
    localSettings?: Record<string, unknown>;
    targetSettings?: Record<string, unknown>;
  },
) {

  const globalConfigFileMock = mock<GlobalConfigFile>({
    config: { settings: globalSettings } as any
  });
  const localConfigFileMock = mock<LocalConfigFile>({
    config: {
      settings: localSettings,
      targets: { t: { settings: targetSettings } }
    } as any
  });

  const settingsManager = new SettingsManager({
    target: 't',
    globalConfig: globalConfigFileMock.get(),
    localConfig: localConfigFileMock.get(),
  });

  return {
    settingsManager,
    globalConfigFileMock,
    localConfigFileMock,
  }
}
