export type GitSetup = 'existing' | 'new' | 'skip' | 'local';

export interface InstallOptions {
  useEmojis: boolean;
  useColors: boolean;
  gitSetup: GitSetup;
  gitRemote?: string;
  gitCustomHost: boolean;
  gitHostName?: string;
  gitHostUser?: string;
  gitHostIdentityFile?: string;
  gitHostConfigName?: string;
  sshFolder?: string;
  fileName: string;
  folder: string;
  rootFolder: string;
  userFolder: string;
}

export type SetupFolderOptions = {
  path: string;
  existing: boolean;
  type: 'skip';
} | {
  path: string;
  existing: boolean;
  type: 'local';
} | {
  path: string;
  existing: boolean;
  remote: string;
  type: 'new';
} | {
  path: string;
  existing: boolean;
  remote: string;
  type: 'existing';
};

export type SSHConfig = {
  use: false;
} | {
  use: true;
  folder: string;
  file: string;
  name: string;
  host: string;
  user: string;
  identityFile: string;
};

export interface SetupOptions {
  configFile: {
    fileName: string;
    path: string;
    existing: boolean;
  };
  scriptsFolder: SetupFolderOptions;
  ssh: SSHConfig;
}

export const opt: InstallOptions = {
  useEmojis: true,
  useColors: true,
  userFolder: '~',
  gitSetup: 'skip',
  gitRemote: undefined,
  fileName: '.script-manager.json',
  folder: '.scripts',
  rootFolder: '~',
  gitCustomHost: false,
};

export function isInteractive(): boolean {
  return !Deno.args.includes('--no-interactive') && !Deno.args.includes('-x');
}
