# GIT

Since script-manager is a git repository, it has a built-in way to interact with git. This is done through the `git`, `git.builder` and `git.handler` services.

## GIT Builder

The `git.builder` service is used to create reusable git commands. It allows to specify default options and arguments, and to create a command that can be executed multiple times with different options and arguments. It has the following API:

```typescript
interface IGitCommandBuilder {
  register<P, R>(command: GitGenericCommand<P, R>): void;
  build<P, R>(command: P & { cmd: string }): GitGenericCommand<P, R>;
}

type GitGenericCommand<P, R> = {
  params: P & { cmd: string };
  parser: (res: GitResult) => GitResult<R>;
};
```
