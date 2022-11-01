// deno-lint-ignore-file
import { SettingValue } from '../config/model.ts';
import { singleton } from '../utils/singleton.ts';
import type { ISettingsManager, SettingTarget } from './models.ts';

const SETTINGS_KEY = Symbol('settings');

export const settingKeys = {
  editor: {
    file: {
      tool: 'editor.files.tool',
    },
    folder: {
      tool: 'editor.folder.tool',
    },
    diff: {
      tool: 'editor.diff.tool',
    },
  },
  targets: {
    default: 'targets.default',
  }
}

function getSettingsByName(manager: ISettingsManager, target?: SettingTarget) {
  const getS = target ? (key: string) => manager.getSetting(key, target) : (key: string) => manager.getSetting(key);
  const setS = target ? (key: string, value: any) => manager.setSetting(key, value, target) : (key: string, value: any) => manager.setSetting(key, value);

  return {
    editor: {
      file: {
        get tool() {
          return getS(settingKeys.editor.file.tool);
        },
        set tool(value: SettingValue) {
          setS(settingKeys.editor.file.tool, value);
        }
      },
      folder: {
        get tool() {
          return getS(settingKeys.editor.folder.tool);
        },
        set tool(value: SettingValue) {
          setS(settingKeys.editor.folder.tool, value);
        }
      },
      diff: {
        get tool() {
          return getS(settingKeys.editor.diff.tool);
        },
        set tool(value: SettingValue) {
          setS(settingKeys.editor.diff.tool, value);
        }
      }
    },
    targets: {
      get default() {
        return getS(settingKeys.targets.default);
      },
      set default(value: SettingValue) {
        setS(settingKeys.targets.default, value);
      }
    }
  }
}

export function getSettingsObj(manager: ISettingsManager, target?: SettingTarget) {
  return singleton(() => getSettingsByName(manager, target), SETTINGS_KEY).value;
}
