## Architecture

Script-manager is divided into several modules, each one with a specific purpose and its own set of services. At it's core the `IScriptManager` interface, is the main entry point of both the cli and the framework.
At startup, the cli will create an instance of the `ScriptManager` class, which implements the `IScriptManager` interface, and will pass it to the `Cli` class, which will then execute the requested command.

## Initialization

The `ScriptManager` class can be initialize by calling the helper function `core/init.ts#initScriptManager`, which will create an instance of the class and initialize it. The initialization process is divided into the following steps:

1. Register the core [services](/advanced/services).
2. Configure the [logger](/advanced/logger) with provided [parameters](#initialization-parameters).
3. Loads the [configuration](/advanced/configuration) following the [configuration loading](#loading-configuration) process.
4. Creates the `ScriptManager` instance with loaded services and configuration.

### Initialization parameters

The `initScriptManager` function accepts an optional `IInitScriptManagerParams` object, which can be used to configure the initialization process. The following parameters are available:

| Name | Type | Description | Default |
| ---- | ---- | ----------- | ------- |
| `logLevel` | `number` | log level to use, number between 0 and 100 where 0 is disabled, 100 is all | `60` |
| `disableColor` | `boolean` | disable color in the logger | `false` |
| `configFileName` | `string` | name of the configuration file to load | `.smx.json` |
| `configFilePath` | `string` | path to the root configuration file to load | `~/{configFileName}` |
| `useEnvirontment` | `boolean` | use environment variables to override configuration | `true` |
| `scriptsPath` | `string` | root folder, where the .git folder is created and scripts are saved, it's overridden by the `path` property in the root configuration file | `~/.smx` |

### Loading Configuration

The configuration is loaded by priority, following the order below:

1. Loads the environment variables, if `useEnvirontment` is set to `true`.
2. Load current working directory configuration file, if it exists, looks for `configFileName` in the current working directory.
3. Load root configuration file, looks for the `configFilePath`. If can't find it, uses the current working directory.
4. Load user configuration, looks for the `path` property in the root configuration file. If can't find it, uses the `scriptsPath`
