# Subprocess

This service provides an easy way to spawn subprocesses and collect their output. It's an abstraction over the [Deno.Command](https://deno.land/api?s=Deno.Command) module and provides a simple interface to work with.

##  ISubprocessFactory

The `ISubprocessFactory` interface provides a way to create subprocesses. It provides the following API:

```ts
interface ISubprocessFactory {
  create<T>(options: SubprocessOptions<T>): Subprocess<T>;
  exec<T>(options: SubprocessOptions<T>): Promise<T>;
}
```

| Method | Description |
| --- | --- |
| `create<T>(options: SubprocessOptions<T>): Subprocess<T>` | Creates a subprocess with the given options. |
| `exec<T>(options: SubprocessOptions<T>): Promise<T>` | Creates a subprocess with the given options and waits for it to finish. |


## SubprocessOptions

When creating a subprocess, you can pass the following options:

```ts
interface SubprocessOptions<T> {
  target: string | URL | {
    default: string | URL;
    [key: string]: string | URL;
  };
  runOptions?: Deno.CommandOptions;
  handler?: (res: CommandResult) => T;
}
```

| Property | Description |
| --- | --- |
| `target` | The target to run. It can be a string, an URL or an object with multiple targets for different OS. |
| `runOptions` | The options to pass to the `Deno.Command` method. |
| `handler` | A function to handle the result of the subprocess. |

## How to use

The following example shows how to use the `Subprocess` service:

```ts
const factory = services.get('subprocess')
const sub = factory.create({
  target: {
    default: 'vim',
    windows: 'nvim'
  },
  runOptions: {
    args: ['--version']
  },
  handler: (res) => {
    const version = res.output.split('\n')[0].split(' ')[4]
    return version
  }
})

const version = await sub.exec()
```
> Calls vim by default, or nvim if running on Windows. It then parses the output to get the version.
