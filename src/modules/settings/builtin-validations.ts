import { settingKeys } from './settings-names.ts';
import type { SettingDefinition } from './models.ts';

export const INTERNAL_SETTINGS: SettingDefinition[] = [
  {
    key: settingKeys.editor.file.tool,
    types: 'string',
  },
  {
    key: settingKeys.editor.folder.tool,
    types: 'string',
  },
  {
    key: settingKeys.editor.diff.tool,
    types: 'string',
  },
  {
    key: settingKeys.targets.default,
    types: 'string',
  },
  {
    key: settingKeys.git.branch,
    types: 'string',
  }
];
