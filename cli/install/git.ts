import { GitSetup, isInteractive, opt } from './options.ts';
import { Confirm, Select } from 'https://deno.land/x/cliffy@v1.0.0-rc.1/prompt/mod.ts';
import { C, requestInput } from './utils.ts';

async function loadGitSetupAction(): Promise<GitSetup> {
  if (Deno.args.includes('--git-skip')) return 'skip';
  if (Deno.args.includes('--git-local')) return 'local';
  if (Deno.args.includes('--git-init')) return 'new';
  if (Deno.args.includes('--git-remote')) return 'existing';

  if (!isInteractive()) throw new Error('Git flag is required in non-interactive mode!');

  return await Select.prompt<GitSetup>({
    message: C('yellow', 'How do you want to use GIT?'),
    options: [
      { name: 'Use existing GIT remote repository', value: 'existing' },
      { name: 'Create new GIT remote repository', value: 'new' },
      { name: 'Create local GIT repository', value: 'local' },
      { name: 'Skip GIT setup', value: 'skip' },
    ],
  }) as unknown as GitSetup;
}

async function loadGitRemote(): Promise<string | undefined> {
  if (opt.gitSetup === 'skip' || opt.gitSetup === 'local') return;

  return await requestInput({
    message: 'Enter GIT remote repository URL:',
    flag: '--git-remote',
  });
}

async function loadGitCustomHost(): Promise<boolean> {
  const gitCustomHost = Deno.args.includes('--git-custom-host');
  if (gitCustomHost) return true;

  if (!isInteractive()) return false;

  return await Confirm.prompt({
    message: C('yellow', 'Do you want to use a custom SSH host for git'),
    default: false,
    hint: 'Allows to have multiple SSH keys for different hosts',
  });
}

async function loadSHHConfigName(): Promise<string> {
  return await requestInput({
    message: 'Enter SSH config name:',
    flag: '--git-ssh-config-name',
    defaultValue: 'script-repo',
    hint: 'Name of config entry',
  });
}

export function loadSSHHostName(): Promise<string> {
  return requestInput({
    message: 'Enter SSH host name:',
    flag: '--git-ssh-host-name',
    hint: 'Host name from SSH config',
    defaultValue: 'github.com',
  });
}

export async function loadSSHUser(): Promise<string> {
  return await requestInput({
    message: 'Enter SSH user name:',
    flag: '--git-ssh-user',
    hint: 'User name from SSH config',
    defaultValue: 'git',
  });
}

export async function loadSSHIdentityFile(): Promise<string> {
  return await requestInput({
    message: 'Enter SSH identity file:',
    flag: '--git-ssh-identity-file',
    hint: 'Name of key to use from SSH config',
    defaultValue: 'id_ed25519',
  });
}

export async function loadSSHFolder(): Promise<string> {
  return await requestInput({
    message: 'Enter SSH folder:',
    flag: '--git-ssh-folder',
    hint: 'Folder where SSH config is located',
    defaultValue: '~/.ssh',
  });
}

export async function loadGitOptions(): Promise<void> {
  opt.gitSetup = await loadGitSetupAction();
  opt.gitRemote = await loadGitRemote();

  if (opt.gitRemote?.startsWith('http')) {
    throw new Error('HTTP protocol is not supported! Please use SSH instead.');
  }

  if (opt.gitSetup === 'skip' || opt.gitSetup === 'local') return;
  if (!isInteractive() && !opt.gitRemote) {
    throw new Error('Git flag is required in non-interactive mode!');
  }

  opt.gitCustomHost = await loadGitCustomHost();
  if (opt.gitCustomHost) {
    opt.gitHostConfigName = await loadSHHConfigName();
    opt.gitHostName = await loadSSHHostName();
    opt.gitHostUser = await loadSSHUser();
    opt.gitHostIdentityFile = await loadSSHIdentityFile();
    opt.sshFolder = await loadSSHFolder();

    opt.gitRemote = opt.gitRemote?.replace(
      /(.*)@(?:.*):(.*)/g,
      `$1@${opt.gitHostConfigName || 'unknown'}:$2`,
    );
  }
}

export async function validateGIT(): Promise<string> {
  const cmd = new Deno.Command('git', {
    args: ['--version'],
  });
  const out = await cmd.output();
  const version = new TextDecoder().decode(out.stdout);
  if (!version.startsWith('git version')) throw new Error('GIT is not installed!');
  return version;
}
