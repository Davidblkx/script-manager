# GIT

At is core script manager is a git repository. So is only natural that it comes with a GIT interface. Although it is not a full git client, it is enough for most common tasks. It's built on top of [AppInterface](/advanced/app-interface) and [Subprocess](/advanced/subprocess) services, so it can be extended to support any git action.

## How to use

```typescript
import { services } from '@smx/modules/services.ts';

const git = services.get('git');
const { created } = await git.run('checkout', {
  branch: 'feat/1',
  b: true,
})

if (created) {
  console.log('Branch created');
} else {
  console.log('Branch already exists');
}
```


## Built-in commands

- checkout: Checkout a branch, allows to create it if it doesn't exist.
- status: Get the status of the repository.
- rev-parse: Get the current git dir and other plumbing information.

## Built-in helpers

- is-git-repo: Check if the current directory is a git repository.
