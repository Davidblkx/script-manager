# Configuration

The configuration module allows to persist data and settings between sessions. It is also used to store the settings of the framework itself. Each entry has a domain, which allows to groups settings and avoid clashes between different modules. The actual storage in the file system is comply abstracted and out of scope of this module. This module is divided into two parts: the configuration provider and the configuration Handler.

## Configuration Provider

The configuration provider is an in-memory storage used to define configuration entries and their default values. It's a singleton that can be accessed using services.get('config.provider'). See [Services](/advanced/services) for more details. It's main purpose is to declare configuration entries so other modules can access them. It also allows to search for configuration entries and list all the configuration entries of a domain.

### Configuration Definition

The configuration definition is a simple object with the following API:
```typescript
const PathConfig: Config<string> = {
  domain: "my-module",
  key: "path",
  defaultValue: "~/my-module",
  parser: defaultParser(""),
  description: "A description of the configuration entry",
};
```

| Property | Type | Description | required |
| --- | --- | --- | --- |
| domain | string | The domain of the configuration entry. | yes |
| key | string | The key of the configuration entry. | yes |
| defaultValue | T | The default value of the configuration entry. | yes |
| parser | Parser<T> | The parser to use to parse the configuration entry. | yes |
| description | string | A description of the configuration entry. | no |

> Note: The parser is a function that takes an `unknown` and returns the parsed value. It is used to parse the configuration entry from a string to the actual type. The framework provides a few default parsers, see [Parsers](#parsers) for more information.

### Declare Configuration Entries

New configuration are declared using the `declare<T>(Config<T>)` method of the configuration provider. The `declare<T>(Config<T>)` method is a generic method that takes the type of the configuration entry as a parameter. The type is used to type the returned `Config<T>` object. Declaring a value allows to other modules to access it and helps a user know what configuration entries are available.

```typescript
const PathConfig: Config<string> = {
  domain: "my-module",
  key: "path",
  defaultValue: "~/my-module",
  parser: defaultParser(""),
  description: "A description of the configuration entry",
};

services.get('config.provider').declare(PathConfig);
```

### Search Configuration Entries

The `search(key: string, domain?: string): Config<unknown> | undefined` method of the configuration provider allows to search for a configuration entry. It returns the configuration entry if it exists, `undefined` otherwise. By default it searchs in the `smx` domain.

```typescript
const PathConfig: Config<string> = {
  domain: "my-module",
  key: "path",
  defaultValue: "~/my-module",
  parser: defaultParser(""),
  description: "A description of the configuration entry",
};

services.get('config.provider').declare(PathConfig);

const config = services.get('config.provider').search('path', 'my-module');
// config is equal to PathConfig
```

### List domain configuration entries

The `domain(domain: string): Config<unknown>[]` method of the configuration provider allows to list all the configuration entries of a domain.

### Parsers

// TODO: Add documentation about parsers

## Configuration Handler

The configuration handler is used to read and modify configuration values. It's a singleton that can be accessed using services.get('config.handler'). See [Services](/advanced/services) for more details.

### Read Configuration Values

The `read<T>(config: Config<T>, target?: string, at?: string): T` method of the configuration handler allows to read a configuration value. It returns the configuration value if it exists, the default value otherwise. The `target` parameter allows to target a specific version of the value, usually the OS name. By default it uses the current OS name. The `at` parameter allows to target a specific [reader](#registering-a-readerwriter), if left empty it follows the current order of the readers.

```typescript
const PathConfig: Config<string> = {
  domain: "my-module",
  key: "path",
  defaultValue: "~/my-module",
  parser: defaultParser(""),
  description: "A description of the configuration entry",
};

// Search for my-module.{OS_NAME}.path, then my-module.path and if none of them exists so it returns "~/my-module"
const value = services.get('config.handler').read(PathConfig);

// Search for my-module.linux.path, then my-module.path and if none of them exists so it returns "~/my-module"
const value = services.get('config.handler').read(PathConfig, 'linux');

// Search for my-module.{OS_NAME}.path, then my-module.path in the reader named 'local-config' and if none of them exists so it returns "~/my-module"
const value = services.get('config.handler').read(PathConfig, undefined, 'local-config');
```

### Write Configuration Values

The `write<T>(config: Config<T>, value: T, target?: string, at?: string): void` method of the configuration handler allows to write a configuration value. The `target` parameter allows to target a specific version of the value, usually the OS name. By default it leaves it empty. The `at` parameter allows to target a specific [writer](#registering-a-readerwriter), if left empty it writes to the first available writer.

```typescript
const PathConfig: Config<string> = {
  domain: "my-module",
  key: "path",
  defaultValue: "~/my-module",
  parser: defaultParser(""),
  description: "A description of the configuration entry",
};

// Write "~/my-module" to my-module.path
services.get('config.handler').write(PathConfig, "~/my-module");

// Write "~/my-module" to my-module.linux.path
services.get('config.handler').write(PathConfig, "~/my-module", 'linux');

// Write "~/my-module" to my-module.path in the writer named 'local-config'
services.get('config.handler').write(PathConfig, "~/my-module", undefined, 'local-config');
```

### Registering a Reader/Writer

The configuration handler uses readers and writers to read and write configuration values. Readers and writers are simple objects with the following API:

```typescript
interface IReader {
  readonly name: string;
  isAvailable(): boolean;
  read(key: string): unknown;
}

interface IWriter {
  readonly name: string;
  isAvailable(): boolean;
  write(key: string, value: unknown): void | Promise<void>;
}
```

| Property | Description |
| --- | --- |
| name | The name of the reader/writer. |
| isAvailable | A function that returns `true` if the reader/writer is available, `false` otherwise. |
| read | A function that reads a configuration value in synchronous mode. |
| write | A function that writes a configuration value in synchronous or asynchronous mode. |

They can be registered using the `register(handler: Reader | Writer, at?: number): this`. The `at` parameter allows to specify the position of the reader/writer in the list of readers/writers. By default it adds it at the end of the list. When needed they are loaded starting from position 0 to the last position.

```typescript
const reader = {
  name: 'my-reader',
  isAvailable: () => true,
  read: (key: string) => {
    // Read the configuration value
  },
};

services.get('config.handler').register(reader);
```

#### Helpers for registering readers/writers

The framework provides two helpers methods to register readers and writers:

**regiterEnvironment(at?: number): Promise<this>**

Registers an environment reader. It uses the current environment variables to read configuration values. The `at` parameter allows to specify the position of the reader in the list of readers. By default it adds it at the end of the list. The keys are transformed to uppercase and the `.` are replaced by `_`. It checks if Deno has permission to read environment variables, if not it does nothing.

```typescript
const PathConfig: Config<string> = {
  domain: "my-module",
  key: "path",
  defaultValue: "~/my-module",
  parser: defaultParser(""),
  description: "A description of the configuration entry",
};

services.get('config.handler').registerEnvironment();

// Read the value of the environment variable MY-MODULE_PATH
const value = services.get('config.handler').read(PathConfig);
```

**registerAsyncConfig(config: IAsyncConfig): Promise<this>**

> **This will be refactored in the future.**

Because readers are synchronous, it's not possible to read configuration values from asynchronous sources. The `registerAsyncConfig(config: IAsyncConfig): Promise<this>` method allows to register an asynchronous configuration source. It takes an object with the following API:

```typescript
interface IAsyncConfig {
  readonly name: string;
  read: () => Promise<Record<string, unknown>>;
  write: (data: Record<string, unknown>) => Promise<void>;
  isAvailable?: () => boolean | Promise<boolean>;
  readonly initialData?: Record<string, unknown>;
  readonly at?: number;
}
```

| Property | Description | Required |
| --- | --- | --- |
| name | The name of the reader/writer. | Yes |
| read | A function that reads a configuration value in asynchronous mode. | Yes |
| write | A function that writes a configuration value in asynchronous mode. | Yes |
| isAvailable | A function that returns `true` if the reader/writer is available, `false` otherwise. | No |
| initialData | If defined, uses this value instead of reading it from `read` method | No |
| at | The position of the reader/writer in the list of readers/writers. | No |

> **Note:** The `read` method is only called once, when the configuration handler is initialized, and if the `initialData` property is not defined.

> **Note:** The `isAvailable` method is only called once, when the configuration handler is initialized.
