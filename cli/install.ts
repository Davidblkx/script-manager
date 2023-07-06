import { Confirm } from 'https://deno.land/x/cliffy@v1.0.0-rc.1/prompt/mod.ts';
import { tty } from 'https://deno.land/x/cliffy@v1.0.0-rc.1/ansi/tty.ts';
import {
  C,
  calculateActions,
  E,
  loadFileSettings,
  loadGitOptions,
  opt,
  validateGIT,
  validatePermissions,
} from './install/mod.ts';

opt.useColors = !Deno.args.includes('--no-colors');
opt.useEmojis = !Deno.args.includes('--no-emoji');

async function waitConfirm(m: string): Promise<void> {
  const yes = await Confirm.prompt({
    message: C('yellow', m),
    default: true,
  });
  if (!yes) Deno.exit(0);
}

tty.text(
  C('green', `${E('🐉 ')}Welcome to script-manager installer!${E(' 🐉')}\n\n`),
);

await validatePermissions();

tty.text(C('yellow', 'Validating required apps: '));
const gVersion = await validateGIT();
tty.text(C('green', `\n${E('✅', 'OK!')} (${gVersion.trim()})`));
tty.text('\n\n');

await loadFileSettings();
await loadGitOptions();

const actions = await calculateActions();

tty.text(C('yellow', 'The following actions will be performed:\n'));
actions.forEach((a) => {
  tty.text(`  ${C('green', E('✅', '>'))} ${a}\n`);
});

tty.text('\n');

await waitConfirm('Do you want to continue');
