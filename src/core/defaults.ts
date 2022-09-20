import { SMXConfig } from './models.ts';
import { version } from './version.ts';

export const defaultConfig: SMXConfig = {
  targets: [{
    id: 'main',
    name: 'Main',
    settings: {},
  }],
  units: [],
  default: 'main',
  editor: ['code', '$TARGET'],
  folder: '~/.smx',
  version,
};
