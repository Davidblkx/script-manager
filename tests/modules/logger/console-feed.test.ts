import { describe, it } from '$deno/testing/bdd.ts';
import { spy, assertSpyCalls } from '$deno/testing/mock.ts';
import { createConsoleFeed, LogLevel } from '../../../modules/logger/mod.ts';

describe('Logger/console-feed', () => {
  it('use log method', () => {
    const target = {
      debug: spy(),
      info: spy(),
      warn: spy(),
      error: spy(),
    };

    const subject = createConsoleFeed(target);

    subject.write({
      domain: 'test',
      message: 'test',
      level: LogLevel.debug,
      extra: [],
      datetime: 0,
    });

    assertSpyCalls(target.debug, 1);
  });

  it('use info method', () => {
    const target = {
      debug: spy(),
      info: spy(),
      warn: spy(),
      error: spy(),
    };

    const subject = createConsoleFeed(target);

    subject.write({
      domain: 'test',
      message: 'test',
      level: LogLevel.info,
      extra: [],
      datetime: 0,
    });

    assertSpyCalls(target.info, 1);
  });

  it('use warn method', () => {
    const target = {
      debug: spy(),
      info: spy(),
      warn: spy(),
      error: spy(),
    };

    const subject = createConsoleFeed(target);

    subject.write({
      domain: 'test',
      message: 'test',
      level: LogLevel.warning,
      extra: [],
      datetime: 0,
    });

    assertSpyCalls(target.warn, 1);
  });

  it('use error method', () => {
    const target = {
      debug: spy(),
      info: spy(),
      warn: spy(),
      error: spy(),
    };

    const subject = createConsoleFeed(target);

    subject.write({
      domain: 'test',
      message: 'test',
      level: LogLevel.error,
      extra: [],
      datetime: 0,
    });

    assertSpyCalls(target.error, 1);
  });

});
