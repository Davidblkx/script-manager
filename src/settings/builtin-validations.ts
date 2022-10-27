import { settingKeys } from './settings-names.ts';
import type { SettingDefinition } from './models.ts';

export const INTERNAL_SETTINGS: SettingDefinition[] = [
  {
    key: settingKeys.editor.files.tool,
    types: 'string',
  },
  {
    key: settingKeys.editor.folder.tool,
    types: 'string',
  },
  {
    key: settingKeys.editor.diff.tool,
    types: 'string',
  }
];
