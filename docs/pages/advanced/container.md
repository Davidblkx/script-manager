---
title: Container
description: Details inversion of control container
index: 1
---

The `Container` is responsible for creating and managing the services. It's a simple implementation of the [inversion of control](https://en.wikipedia.org/wiki/Inversion_of_control) principle, `IoC`, where the services are created and managed by the framework, and are injected into the classes that need them. The `Container` is a singleton, and is created by the framework at startup. It's possible to create a new instance of the `Container` class, but it's not recommended.

### Tokens

The `Container` uses tokens to identify the services. A token is a unique `Symbol` that is used as a key to store the service in the container. The tokens are created by the `createToken` function, which accepts a string as a parameter. The string is used as a description of the token, and is used in the error messages. The `createToken` function returns a `Token` object, which is a `Symbol` with the type as a property. By default every token is a singleton, but it's possible to declare a token as a factory, by passing the `false` value as the second parameter of the `createToken` function.

*example of creating a token*
```javascript
import { createToken } from '@smx/modules/container/mod.ts';

const singletonToken = createToken('singletonToken');

const transientToken = createToken('transientToken', false);
```

### Registering services

Services are registered in the container using the `register` method. The `register` method accepts a `IService<T>` object as a parameter, where `T` is the type of the service. The `IService<T>` object has three properties: `token`, `target` and `deps`. The `token` property is the token used to identify the service, the `target` property is the class that implements the service, and the `deps` property is an array of tokens that are used to resolve the dependencies of the service. The dependencies need to be in the same order as the constructor parameters of the `target` class. It's also possible to use the helper function `declareService<T>` to create an `IService<T>` object.

*example of registering a service*
```javascript
import { declareService, createToken, container } from '@smx/modules/container/mod.ts';
import { DEP1_TOKEN, DEP2_TOKEN } from './deps.ts';

interface IMyService {
  // ...
}

class MyService implements IMyService {
  constructor(dep1, dep2) {
    // ...
  }
}

const MYSERVICE_TOKEN = createToken<IMyService>('MyService');
const myService = declareService(MYSERVICE_TOKEN, MyService, DEP1_TOKEN, DEP2_TOKEN);

container.register(myService);
```

### Resolving services

Services are resolved using the `get<T>` method. The `get<T>` method accepts a `Symbol` as a parameter, and returns the service associated with the `Symbol`. The `get<T>` method throws an error if the service is not registered in the container. With the service is not instanciated, the `get<T>` method creates a new instance of the service, and stores it in the container.

*example of resolving a service*
```javascript
import { container } from '@smx/modules/container/mod.ts';
import { MYSERVICE_TOKEN } from './my-service.ts';

const myService = container.get(MYSERVICE_TOKEN);
```
