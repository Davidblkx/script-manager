# Services

Since the framework is built around the concept of services, it's important to understand how they work and how to use them. It uses the inversion of control principle, `IoC`, where the services are created and managed by the framework, and are injected into the classes that need them. The custom implementation detail can be found in [container](/advanced/container). To agregate the core services, the framework uses the `IServices` interface, which provides a way to easly get a service by name. This interface has a default instance named `services`. The `services` instance is a singleton, and is created by the framework at startup.


*example of loading the logger service*
```typescript
import { services } from '@smx/modules/services.ts';

const logger = services.get('logger');
```

## API

```typescript
interface IServices {
  // Current container
  readonly container: IContainer;
  // Set the current container
  use(container: IContainer): void;
  // Get a service by name
  get<T extends keyof typeof knownServices>(
    key: T
  ): (typeof knownServices)[T] extends Token<infer U> ? U : never;
  // Register core services insto current container
  registerDefaults(): void;
}
```

## Known services

The framework provides a set of core services, which are registered by default. The list of known services is:

- `config.handler`: [IConfigHandler](/advanced/config?id=configuration-handler) - The configuration handler
- `config.provider`: [IConfigProvider](/advanced/config?id=configuration-provider) - The configuration provider
- `logger`: [ILogger](/advanced/logger) - The logger
- `git`: [IGit](/advanced/git) - The high level git interface
- `git.builder`: [IGitBuilder](/advanced/git?id=git-builder) - Create reusable git commands
- `git.handler`: [IGitHandler](/advanced/git?id=git-handler) - Low level git interface
- `subprocess`: [ISubprocess](/advanced/subprocess) - The subprocess handler to run external commands
- `file-system`: [IFileSystem](/advanced/file-system) - The file system handler
- `ssh`: [ISSH](/advanced/ssh) - The ssh service to manage ssh configuration
