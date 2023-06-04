# App Interface Factory (aif)

[Subprocess](advanced/subprocess.md) is usefull to call external programs, but can get verbose quickly and it's hard to reuse calls if we required to change the parameters. For this reason, we can use the `AppInterface` module. It allows to define a set of commands and arguments that can be called from the application.

## Command Specification

A `CommandSpec` is an object that defines a command, default arguments and a parser to map the result. It can than be used in the `IAppInterface` to execute and get the result of the command.

**Example of 'checkout' git command**

```typescript
export type CheckoutParams = {
  branch: string;
  b?: boolean;
  B?: boolean;
};

export type CheckoutResult =  {
  /** Current branch name */
  branch: string;
  /** True, if branch was created */
  created: boolean;
  /** True, if checkout was successful */
  success: boolean;
};

export function checkoutParser(result: CommandResult<CheckoutParams, { cmd: 'checkout' }>): CheckoutResult {
  const success = result.stdout.includes(`branch '${result.spec.branch}'`);
  const created = result.stdout.includes(`new branch '${result.spec.branch}'`);
  const branch = result.spec.branch?.toString();
  return { success, created, branch };
}

export const checkoutSpec: CommandSpec<CheckoutParams, "checkout", CheckoutResult> = {
  cmd: 'checkout',
  parser: checkoutParser,
  args: {
    branch: "master",
  } as CheckoutParams,
};
```
> doing the `as <CheckoutParams>` allows to have optional parameters in the `args` object

In order to easily define the `CommandSpec` we can use the `buildCommandSpec` function that will create the `CommandSpec` object:

```typescript
export const isGitRepoSpec = buildCommandSpec(
  'rev-parse',
  { isInsideWorkTree: true },
  (res) => result.stdout?.trim() === 'true'
)
```
## App specification (AppSpec)

Now that we have defined the `CommandSpec` we can define the full list of commands available (the application specification `AppSpec`):

```typescript
export const gitAppSpec = {
  'is-git-repo': isGitRepoSpec,
  'checkout': checkoutSpec,
};
```
> Note that the keys of the `AppSpec` are the names of the commands that will be used to call the `AppInterface`.

> Can also be defined as: `export const gitAppSpec: AppSpec = { ... }` but will break the type inference, so it's not recommended


## Factory (IAppInterfaceFactory)

The `AppInterfaceFactory` is used to create the `AppInterface` for a specific application. It's a generic interface that takes the `AppSpec` as a parameter and returns the `AppInterface` for that application. It is registered in the `services` as `aif`:

```typescript
export interface IAppInterfaceFactory {
  create<T extends AppSpec>(target: AppTarget, spec: T): IAppInterface<T>;
}
```
> The `AppTarget` is the application that will be used to call the commands, see [Subprocess](advanced/subprocess.md) for more details

With this in mind we you can see the full example of the `AppInterface` for git:

```typescript
import { services } from '@smx/modules/services.ts';
import { buildCommandSpec } from '@smx/modules/aif/mod.ts';

export type CheckoutParams = {
  branch: string;
  b?: boolean;
  B?: boolean;
};

export const checkoutSpec: buildCommandSpec(
  'checkout',
  { branch: 'master' } as CheckoutParams,
  (res) => {
    const success = result.stdout.includes(`branch '${result.spec.branch}'`);
    const created = result.stdout.includes(`new branch '${result.spec.branch}'`);
    const branch = result.spec.branch?.toString();
    return { success, created, branch };
  }
);

export const isGitRepoSpec = buildCommandSpec(
  'rev-parse',
  { isInsideWorkTree: true },
  (res) => result.stdout?.trim() === 'true'
)

export const GitAppSpec = {
  'is-git-repo': isGitRepoSpec,
  'checkout': checkoutSpec,
};

export const git = services.get('aif').create('git', GitAppSpec);
```

that can then be used as:

```typescript
import { git } from './git.ts';

function changeBranch(name: string, create?: boolean) {
  const isGitRepo = await git.run('is-git-repo');
  if (!isGitRepo) {
    throw new Error('Not a git repository');
  }

  const result = await git.run('checkout', { branch: name, b: create });
  if (!result.success) {
    throw new Error(`Failed to checkout branch '${name}'`);
  }

  console.log(`You are now on branch '${result.branch}'`);
}
```

## App Interface (IAppInterface<T extends AppSpec>)

As seen previously, the `AppInterface` is created by the `AppInterfaceFactory` and is used to call the commands defined in the `AppSpec`. It has the following interface:

```typescript
export interface IAppInterface<T extends AppSpec> {
  readonly target: AppTarget;
  readonly spec: T;
  run<P extends keyof T>(
    key: P,
    params?: Partial<T[P]['params']>,
    options?: Deno.CommandOptions,
  ): Promise<ReturnType<T[P]['parser']>>;
  extend<T2 extends AppSpec>(spec: T2): IAppInterface<T & T2>;
}
```
### run

The `run` method is used to call the command and get the result. It takes the name of the command as the first parameter, the parameters as the second parameter and the options as the third parameter. The `run` method returns a `Promise` that will resolve to the result of the command. The `options` parameter is passed to the `Deno.run` method, see [Subprocess](advanced/subprocess.md) for more details.

> Note that if you manually set the `args` in the `options` parameter, it will override the defined parameters.

### extend

The `extend` method is used to extend the `AppInterface` with a new `AppSpec`. It takes the `AppSpec` and merges it with the current `AppSpec` and returns a new `AppInterface` with the merged `AppSpec`. This is usefull to create a new `AppInterface` with the same target but with more commands.
