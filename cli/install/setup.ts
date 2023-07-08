import { C } from './utils.ts';
import { isInteractive, opt, SetupOptions } from './options.ts';
import { join, toFileUrl } from 'https://deno.land/std@0.191.0/path/mod.ts';

export async function validatePermissions() {
  await ensurePermission(
    { name: 'env' },
    '--allow-env',
    'Requesting access to environment variables.',
  );
  await ensurePermission(
    { name: 'read' },
    '--allow-read',
    'Requesting access to read files.',
  );
  await ensurePermission(
    { name: 'write' },
    '--allow-write',
    'Requesting access to write files.',
  );
  await ensurePermission(
    { name: 'run' },
    '--allow-run',
    'Requesting access to run executables.',
  );
}

async function ensurePermission(
  d: Deno.PermissionDescriptor,
  flag: string,
  reason: string,
) {
  const { state } = await Deno.permissions.query(d);
  if (state === 'granted') return;

  if (!isInteractive()) {
    throw new Error(`${flag} flag is required in non-interactive mode!`);
  }

  console.log(C('yellow', reason));
  const { state: newState } = await Deno.permissions.request(d);
  if (newState === 'granted') return;

  throw new Error(`${d.name} permission is required! State: ${newState}`);
}

export async function validateOptions(): Promise<SetupOptions> {
  const setup: SetupOptions = {
    configFile: {
      existing: true,
      fileName: '_',
      path: '_',
    },
    scriptsFolder: {
      type: 'skip',
      path: '_',
      existing: true,
    },
    ssh: { use: false },
    cli: {
      name: opt.cliName,
      x: opt.xCliName,
    },
  };

  setup.configFile.fileName = opt.fileName;
  setup.configFile.path = join(opt.rootFolder, opt.fileName);
  setup.configFile.existing = (await resolvePath(setup.configFile.path, 'F'))[1];

  const fullFolderPath = join(opt.rootFolder, opt.folder);
  const folderExists = (await resolvePath(fullFolderPath, 'D'))[1];
  switch (opt.gitSetup) {
    case 'skip':
      setup.scriptsFolder = {
        type: 'skip',
        path: fullFolderPath,
        existing: folderExists,
      };
      break;
    case 'local':
      setup.scriptsFolder = {
        type: 'local',
        path: fullFolderPath,
        existing: folderExists,
      };
      break;
    case 'new':
      setup.scriptsFolder = {
        type: 'new',
        path: fullFolderPath,
        existing: folderExists,
        remote: opt.gitRemote!,
      };
      break;
    case 'existing':
      setup.scriptsFolder = {
        type: 'existing',
        path: fullFolderPath,
        existing: folderExists,
        remote: opt.gitRemote!,
      };
  }

  if (opt.gitCustomHost) {
    setup.ssh = {
      use: true,
      folder: opt.sshFolder!,
      file: 'config',
      host: opt.gitHostName!,
      name: opt.gitHostConfigName!,
      user: opt.gitHostUser!,
      identityFile: join(opt.sshFolder!, opt.gitHostIdentityFile!),
    };
  }

  return setup;
}

export async function resolvePath(path: string, t: 'F' | 'D'): Promise<[URL, boolean]> {
  const url = toFileUrl(path);
  try {
    const info = await Deno.stat(url);
    if (info.isDirectory && t === 'F') {
      throw new Error(`Path ${path} is a directory, but file is expected.`);
    }
    if (info.isFile && t === 'D') {
      throw new Error(`Path ${path} is a file, but directory is expected.`);
    }

    if (info.isSymlink) {
      const realPath = await Deno.readLink(url);
      return resolvePath(realPath, t);
    }

    return [url, true];
  } catch {
    return [url, false];
  }
}

export async function calculateActions(): Promise<string[]> {
  const {
    configFile,
    scriptsFolder,
    ssh,
    cli,
  } = await validateOptions();

  let actionCount = 0;
  const actions: string[] = [];

  if (configFile.existing) {
    actions.push(
      `${++actionCount}: ${C('yellow', 'Update config file:')} ${
        C('blue', configFile.path)
      }`,
    );
  } else {
    actions.push(
      `${++actionCount}: ${C('yellow', 'Create config file:')} ${
        C('blue', configFile.path)
      }`,
    );
  }

  actions.push(
    `${++actionCount}: ${C('yellow', 'Set scripts folder to:')} ${
      C('blue', scriptsFolder.path)
    }`,
  );

  if (!scriptsFolder.existing) {
    switch (scriptsFolder.type) {
      case 'skip':
      case 'new':
      case 'local':
        actions.push(
          `${++actionCount}: ${C('yellow', 'Create scripts folder:')} ${
            C('blue', scriptsFolder.path)
          }`,
        );
        break;
      case 'existing':
        actions.push(
          `${++actionCount}: ${C('yellow', 'Clone')} ${C('blue', scriptsFolder.remote)} ${
            C('yellow', 'to')
          } ${C('blue', scriptsFolder.path)}`,
        );
    }
  } else {
    switch (scriptsFolder.type) {
      case 'local':
      case 'new':
        actions.push(
          `${++actionCount}: ${C('yellow', 'Init GIT repository:')} ${
            C('blue', scriptsFolder.path)
          }`,
        );
    }
  }

  if (ssh.use) {
    actions.push(
      `${++actionCount}: ${C('yellow', 'Set SSH path:')} ${C('blue', ssh.folder)}`,
    );
  }

  actions.push(
    `${++actionCount}: ${C('yellow', 'Install script-manager CLI as')} ${
      C('green', cli.name)
    }`,
  );

  actions.push(
    `${++actionCount}: ${C('yellow', 'Install script-manager executor CLI as')} ${
      C('green', cli.x)
    }`,
  );

  if (ssh.use) {
    actions.push(
      `${++actionCount}: ${C('yellow', 'Add config to SSH:')}
  Host ${ssh.name}
    HostName ${ssh.host}
    User ${ssh.user}
    IdentityFile ${ssh.identityFile}`,
    );
  }

  switch (scriptsFolder.type) {
    case 'new':
      actions.push(
        `${++actionCount}: ${C('yellow', 'Ensure GIT remote:')} ${
          C('blue', scriptsFolder.remote)
        }`,
      );
      actions.push(
        `${++actionCount}: ${C('yellow', 'Push and track upstream:')} ${
          C('blue', scriptsFolder.remote)
        }`,
      );
      break;
    case 'existing':
      actions.push(
        `${++actionCount}: ${C('yellow', 'Sync with upstream:')} ${
          C('blue', scriptsFolder.remote)
        }`,
      );
      break;
  }

  return actions;
}
