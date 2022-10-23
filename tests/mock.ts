// deno-lint-ignore-file no-explicit-any
import { assertEquals } from 'deno/testing/asserts.ts';
import { logger, LogLevel } from '../src/logger.ts';

logger.setLogLevel(LogLevel.disabled);

function assertObjectEquals(actual: any, expected: any) {
  if (typeof actual !== 'object' && actual === expected) { return; }
  if (actual === null || expected === null) {
    assertEquals(actual, expected, 'Called with null');
  }

  for (const key in expected) {
    if (typeof expected[key] === 'object' && typeof actual[key] === 'object') {
      assertObjectEquals(actual[key], expected[key]);
    } else {
      assertEquals(actual[key], expected[key], `${key} is not equal, expected ${expected[key]} but got ${actual[key]}`);
    }
  }
}

export class Mock<T> {
  #mocks: Record<any, any> = {};
  #calls: Record<any, number> = {};
  #callArgs: Record<any, any> = {};
  #all: boolean;
  #base: Partial<T> = {};

  constructor(base: Partial<T> = {}, stubAll = false) {
    this.#all = stubAll;
    this.#base = base;
  }

  public stub<K extends keyof T>(method: K, stub: T[K]): this {
    this.#mocks[method.toString()] = stub;
    return this;
  }

  public assertWasCalled<K extends keyof T>(method: K, times = 1): void {
    const methodString = method.toString();
    const calls = this.#calls[methodString] || 0;
    assertEquals(calls, times, `Method ${methodString} was called ${calls} times, expected ${times} times`);
  }

  public assertWasCalledWith<K extends keyof T>(method: K, ...args: any[]): void {
    const methodString = method.toString();
    const callArgs = (this.#callArgs[methodString] || []) as unknown as [];

    assertEquals(callArgs.length, args.length, `Method ${methodString} was called with ${callArgs.length} arguments, expected ${args.length} arguments`);

    for (let i = 0; i < args.length; i++) {
      if (typeof args[i] === 'object') {
        assertObjectEquals(callArgs[i], args[i]);
      } else {
        assertEquals(callArgs[i], args[i], `Method ${methodString} was called with ${callArgs[i]} at index ${i}, expected ${args[i]}`);
      }
    }
  }

  public get(): T {
    return new Proxy({}, {
      get: (_, key) => {
        const sKey = key.toString();
        this.#calls[sKey] = (this.#calls[sKey] || 0) + 1;

        if (key in this.#base) {
          return Reflect.get(this.#base, key);
        }

        if (this.#all || key in this.#mocks) {
          return (...args: any[]) => {
            this.#callArgs[sKey] = args;
            return this.#mocks[sKey]?.(...args);
          }
        }

        throw new Error(`Method ${sKey} is not mocked!`);
      },
    }) as any;
  }
}

export const mock = <T>(v: Partial<T> = {}): Mock<T> => new Mock<T>(v);
export const mockAll = <T>(v: Partial<T> = {}): Mock<T> => new Mock<T>(v, true);
