import { opt } from './options.ts';
import { requestInput } from './utils.ts';

export async function loadDomainSettings() {
  opt.cliName = await requestInput({
    message: 'Enter name for script manager cli:',
    defaultValue: 'sm',
    hint: 'This is the name of the cli that you will use to call script-manager',
    flag: '--cli-name',
  });

  opt.xCliName = await requestInput({
    message: 'Enter name for executor cli:',
    defaultValue: 'smx',
    hint: 'This is the name of the cli that you will use to execute scripts',
    flag: '--x-cli-name',
  });
}
