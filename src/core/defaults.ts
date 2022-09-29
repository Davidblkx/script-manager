import { join } from 'deno/path/mod.ts';

import { SMXConfig } from './models.ts';
import { version } from './version.ts';
import { getHomeDirectory } from '../utils/config.ts';

const folder = join(getHomeDirectory() || '~', '.smx');

export const defaultConfig: SMXConfig = {
  targets: [{
    id: 'main',
    name: 'Main',
    settings: {},
  }],
  units: [],
  default: 'main',
  editor: ['code', '$TARGET'],
  folder,
  version,
};
