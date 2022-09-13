import { ensureDir } from 'deno/fs/mod.ts';
import { SMXConfig } from '../modules/config.ts';
import { getConfigDirectory, checkConfigExists, getDefaultRepo, getConfigPath } from '../utils/config.ts';
import { prompt } from '../utils/prompt.ts';

export async function initialize(force: boolean) {
  if (await checkConfigExists() && !force) {
    console.log('Config file already exists.');
    console.log('Run `smx --force-init` to overwrite the existing config file.');
    return;
  }

  console.log('Initializing config file...');
  await ensureDir(getConfigDirectory());

  const config: SMXConfig = {
    engines: [],
    dotFiles: [],
    global: false,
    repo: '',
  };

  const isGlobal = (await prompt('Do you want to add bin to global PATH? (y/N)') === 'y');
  config.global = isGlobal;

  const repo = await prompt('Enter the path to sync (empty for default)');
  config.repo = repo || getDefaultRepo();
  console.log(`Using ${config.repo} as the script path`);

  await Deno.writeTextFile(getConfigPath(), JSON.stringify(config, null, 2));
  console.log('Config file initialized.');
}
