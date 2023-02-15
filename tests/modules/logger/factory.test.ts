import { describe, it } from '$deno/testing/bdd.ts';
import { spy, assertSpyCall, assertSpyCalls } from '$deno/testing/mock.ts';
import { LogLevel, LogFeed, LoggerFactory } from '../../../modules/logger/mod.ts';

describe('Logger/factory', () => {

  it('writes to the feed with the right params', () => {
    const writeSpy = spy();
    const feed = {
      async: false,
      write: writeSpy,
    } as LogFeed;

    const subject = new LoggerFactory()
      .addFeed(feed)
      .setLogLevel(LogLevel.debug)
      .setDatetimeProvider(() => 123)
      .get('my-domain');

    subject.debug('test', 1, 2, 3);

    assertSpyCall(writeSpy, 0, {
      args: [{
        domain: 'my-domain',
        message: 'test',
        datetime: 123,
        extra: [1, 2, 3],
        level: LogLevel.debug,
      }]
    });

  });

  it('does not write when lower log level', () => {
    const writeSpy = spy();
    const feed = {
      async: false,
      write: writeSpy,
    } as LogFeed;

    const subject = new LoggerFactory()
      .addFeed(feed)
      .setLogLevel(LogLevel.info)
      .setDatetimeProvider(() => 123)
      .get('my-domain');

    subject.debug('test', 1, 2, 3);

    assertSpyCalls(writeSpy, 0);
  });

  it('does not write when assert succeeds', async () => {
    const writeSpy = spy();
    const feed = {
      async: false,
      write: writeSpy,
    } as LogFeed;

    const subject = new LoggerFactory()
      .addFeed(feed)
      .setLogLevel(LogLevel.debug)
      .setDatetimeProvider(() => 123)
      .get('my-domain');

    await subject.assert(() => true, 'test');

    assertSpyCalls(writeSpy, 0);
  });

  it('writes when assert fails', async () => {
    const writeSpy = spy();
    const feed = {
      async: false,
      write: writeSpy,
    } as LogFeed;

    const subject = new LoggerFactory()
      .addFeed(feed)
      .setLogLevel(LogLevel.debug)
      .setDatetimeProvider(() => 123)
      .get('my-domain');

    await subject.assert(() => false, 'test');

    assertSpyCall(writeSpy, 0, {
      args: [{
        domain: 'my-domain',
        message: 'test',
        datetime: 123,
        extra: [],
        level: LogLevel.error,
        $assert: false,
      }]
    });
  });

  it('handles error object', () => {
    const writeSpy = spy();
    const feed = {
      async: false,
      write: writeSpy,
    } as LogFeed;

    const subject = new LoggerFactory()
      .addFeed(feed)
      .setLogLevel(LogLevel.debug)
      .setDatetimeProvider(() => 123)
      .get('my-domain');

    const error = new Error('my error test');
    subject.error(error);

    assertSpyCall(writeSpy, 0, {
      args: [{
        domain: 'my-domain',
        message: 'my error test',
        datetime: 123,
        extra: [error],
        level: LogLevel.error,
      }]
    });
  });

});
