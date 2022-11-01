import { assertEquals } from "deno/testing/asserts.ts";

import { parseGitStatus } from '../../../src/modules/git/parser.ts';

Deno.test('#git.parse', async gitStep => {
  await gitStep.step('Read branch', () => {
    const info = parseGitStatus('## master');
    assertEquals(info.branch, 'master');
  });

  await gitStep.step('Read branch with remote', () => {
    const info = parseGitStatus('## master...origin/master');
    assertEquals(info.branch, 'master');
    assertEquals(info.remote, 'origin/master');
  });

  await gitStep.step('Read branch with remote and ahead', () => {
    const info = parseGitStatus('## my/master...origin/master [ahead 1]');
    assertEquals(info.branch, 'my/master');
    assertEquals(info.remote, 'origin/master');
    assertEquals(info.ahead, 1);
  });

  await gitStep.step('Read branch with remote and behind', () => {
    const info = parseGitStatus('## master...origin/master [behind 1]');
    assertEquals(info.branch, 'master');
    assertEquals(info.remote, 'origin/master');
    assertEquals(info.behind, 1);
  });

  await gitStep.step('Read branch with remote and ahead and behind', () => {
    const info = parseGitStatus('## master...origin/master [ahead 1, behind 2]');
    assertEquals(info.branch, 'master');
    assertEquals(info.remote, 'origin/master');
    assertEquals(info.ahead, 1);
    assertEquals(info.behind, 2);
  });

  await gitStep.step('Detect repo not init', () => {
    const info = parseGitStatus('', 'fatal: not a git repository (or any of the parent directories): .git');
    assertEquals(info.isGit, false);
  });

  await gitStep.step('Count changes', () => {
    const info = parseGitStatus(`M src/modules/git/parser.ts
M src/modules/git/handler.ts`);
    assertEquals(info.changes, 2);
  });

  await gitStep.step('Detect dirty', () => {
    const info = parseGitStatus(`M src/modules/git/parser.ts`);
    assertEquals(info.dirty, true);
  });

  await gitStep.step('Detect clean', () => {
    const info = parseGitStatus(`## master...origin/master [ahead 1, behind 2]`);
    assertEquals(info.dirty, false);
  });

  await gitStep.step('Detect can pull', () => {
    const info = parseGitStatus(`## master...origin/master [ahead 1, behind 2]`);
    assertEquals(info.canPull, true);
  });

  await gitStep.step('Detect can push', () => {
    const info = parseGitStatus(`## master...origin/master [ahead 1, behind 2]`);
    assertEquals(info.canPush, true);
  });

  await gitStep.step('Detect can not pull', () => {
    const info = parseGitStatus(`## master...origin/master [ahead 1]`);
    assertEquals(info.canPull, false);
  });

  await gitStep.step('Detect can not push', () => {
    const info = parseGitStatus(`## master...origin/master [behind 2]`);
    assertEquals(info.canPush, false);
  });

  await gitStep.step('Detect can not pull on dirty', () => {
    const info = parseGitStatus(`M src/modules/git/parser.ts
## master...origin/master [ahead 1, behind 2]`);
    assertEquals(info.canPull, false);
  });

  await gitStep.step('Works as expected', () => {
    const message = `## master...origin/master [ahead 1, behind 3]
M src/lib.ts
D src/units/__.ts
D src/units/core.ts
D src/units/core/bin/__.ts
D src/units/core/bin/init.ts
D src/units/core/bin/new.ts
D src/units/core/bin/sync.ts
D src/units/core/bin/utils.ts
D src/units/core/exports.ts
D src/units/core/git.ts
D src/units/execute.ts
D src/units/models.ts
D src/units/unit-manager.ts
?? src/modules/git/
?? tests/modules/git/`;

    const info = parseGitStatus(message);

    assertEquals(info.branch, 'master');
    assertEquals(info.remote, 'origin/master');
    assertEquals(info.ahead, 1);
    assertEquals(info.behind, 3);
    assertEquals(info.changes, 15);
    assertEquals(info.dirty, true);
    assertEquals(info.canPull, false);
    assertEquals(info.canPush, true);
    assertEquals(info.isGit, true);
  });
})
