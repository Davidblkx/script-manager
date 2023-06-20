# Runners

Running scripts is the main purpose of the `runners` module. It provides a set of runners that can be used to run scripts in different ways. The runners are registered in the `runners` service, which is a singleton. The `runners` service is created by the framework at startup.

## Running a script

To run a script, you need to get the `runners` service, and call the `create` method. The `create` method takes a `URL` object as parameter, which contains the path to the script to run, and the `args` to pass to the script.

```typescript
import { services } from '@smx/modules/services.ts';

const runners = services.get('runners');
const myScript = runners.create(new URL('file:///path/to/script.ts'), {
  args: ['--foo', 'bar'],
});

const { success } = await myScript.run();
```

## Custom runner

You can create your own runner by implementing the `IRunner` interface. The `IRunner` interface is defined as follow:

```typescript
interface IRunner {
  name: string;
  description?: string;
  target: RegExp;
  run: (file: URL, args: string[]) => Promise<IRunResult>;
}
```

| Property     | Description                                                                                   |
| ------------ | --------------------------------------------------------------------------------------------- |
| `name`       | The name of the runner.                                                                       |
| `description`| The description of the runner.                                                                |
| `target`     | A regular expression that matches the file path of the script to run.                         |
| `run`        | The method that runs the script. It takes the file path of the script to run, and the args to pass to the script. |

New runners can be registered in the `runners` service using the `add` method.

```typescript
import { services } from '@smx/modules/services.ts';

const runners = services.get('runners');

runners.add({
  name: 'my-runner',
  target: /.*\.my-extension$/,
  run: async (file, args) => {
    // ...
  },
});
```

> The order in which the runners are registered is important. The first runner that matches the file path will be used to run the script.

## Default runner

It's possible to set a default runner that will be used when no runner matches the file path of the script to run. The default runner is set using the `setDefault` method of the `runners` service.

```typescript
import { services } from '@smx/modules/services.ts';

const runners = services.get('runners');

runners.setDefault({
  name: 'my-runner',
  target: /.*\.my-extension$/,
  run: async (file, args) => {
    // ...
  },
});
```
> By default, the `runners` service has a default runner that runs a file using the [Subprocess](/advanced/subprocess)

## Built-in runners

### internal-modules

This runner is used to run any file that matches `/mod\.(ts|js)$/;`. It will look for an exported function called `main` and invoke it passing the `args` array and the `IScriptManager` instance.
