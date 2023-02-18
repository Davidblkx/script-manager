import { describe, it } from '$deno/testing/bdd.ts';
import { assertEquals, assertThrows } from '$deno/testing/asserts.ts';
import { spy, assertSpyCall, assertSpyCalls } from '$deno/testing/mock.ts';
import { SettingsContainer, SettingsSource } from '../../../modules/settings/mod.ts';

describe('Settings/container', () => {
  describe('.add', () => {
    it('adds a source to the container', () => {
      const container = new SettingsContainer();
      const source = {} as SettingsSource;

      container.add(source);

      assertEquals(container.sources, [source]);
    });

    it('adds a source to the container at a priority', () => {
      const container = new SettingsContainer();
      const source1 = {} as SettingsSource;
      const source2 = {} as SettingsSource;

      container.add(source1);
      container.add(source2, 0);

      assertEquals(container.sources, [source2, source1]);
    });

    it('does not add a source twice', () => {
      const container = new SettingsContainer();
      const source = {} as SettingsSource;

      container.add(source);
      container.add(source);

      assertEquals(container.sources, [source]);
    });

    it('sets the default source', () => {
      const container = new SettingsContainer();
      const source1 = {} as SettingsSource;
      const source2 = {} as SettingsSource;

      container.add(source1);
      container.add(source2, -1, true);

      assertEquals(container.default, source2);
    });

    it('sets the default source to the first added', () => {
      const container = new SettingsContainer();
      const source1 = {} as SettingsSource;
      const source2 = {} as SettingsSource;

      container.add(source1);
      container.add(source2);

      assertEquals(container.default, source1);
    });
  });

  describe('.remove', () => {
    it('removes a source from the container', () => {
      const container = new SettingsContainer();
      const source = {} as SettingsSource;

      container.add(source);
      container.remove(source);

      assertEquals(container.sources, []);
    });

    it('removes a source from the container by name', () => {
      const container = new SettingsContainer();
      const source = { name: 'test' } as SettingsSource;

      container.add(source);
      container.remove(source.name);

      assertEquals(container.sources, []);
    });

    it('does not remove a source that is not in the container', () => {
      const container = new SettingsContainer();
      const source = {} as SettingsSource;

      container.remove(source);

      assertEquals(container.sources, []);
    });

    it('remove default', () => {
      const container = new SettingsContainer();
      const source1 = {} as SettingsSource;
      const source2 = {} as SettingsSource;

      container.add(source1);
      container.add(source2);
      container.remove(source1);

      assertEquals(container.default, undefined);
    });
  });

  describe('.defaultTo', () => {
    it('sets the default source', () => {
      const container = new SettingsContainer();
      const source1 = {} as SettingsSource;
      const source2 = {} as SettingsSource;

      container.add(source1);
      container.add(source2);
      container.defaultTo(source2);

      assertEquals(container.default, source2);
    });

    it('sets the default source by name', () => {
      const container = new SettingsContainer();
      const source1 = { name: 'test1' } as SettingsSource;
      const source2 = { name: 'test2' } as SettingsSource;

      container.add(source1);
      container.add(source2);
      container.defaultTo(source2.name);

      assertEquals(container.default, source2);
    });

    it('does not set the default source if it is not in the container', () => {
      const container = new SettingsContainer();
      const source1 = {} as SettingsSource;
      const source2 = {} as SettingsSource;

      container.add(source1);
      container.defaultTo(source2);

      assertEquals(container.default, source1);
    });
  });

  describe('.read', () => {
    it('reads from first result', () => {
      const container = new SettingsContainer();

      const result = {};

      const source1 = { read: () => undefined } as unknown as SettingsSource;
      const source2 = { read: () => result } as unknown as SettingsSource;

      container.add(source1);
      container.add(source2);

      assertEquals(container.read('test'), result);
    });

    it('reads from defined source', () => {
      const container = new SettingsContainer();

      const result1 = {};
      const result2 = {};

      const source1 = { name: 'test1', read: () => result1 } as unknown as SettingsSource;
      const source2 = { name: 'test2', read: () => result2 } as unknown as SettingsSource;

      container.add(source1);
      container.add(source2);

      assertEquals(container.read('test', source2.name), result2);
    });
  });

  describe('.write', () => {
    it('writes to default source', () => {
      const container = new SettingsContainer();

      const writeSpy = spy();

      const source1 = { } as SettingsSource;
      const source2 = { write: writeSpy } as unknown as SettingsSource;

      container.add(source1);
      container.add(source2);
      container.defaultTo(source2);

      container.write({ key: 'test', value: 'test', priority: 0 });

      assertSpyCall(writeSpy, 0, { args: [{ key: 'test', value: 'test', priority: 0 }] });
    });

    it('writes to source by name', () => {
      const container = new SettingsContainer();

      const writeSpy = spy();

      const source1 = { name: 'test1' } as SettingsSource;
      const source2 = { name: 'test2', write: writeSpy } as unknown as SettingsSource;

      container.add(source1);
      container.add(source2);

      container.write({ key: 'test', value: 'test', priority: 0 }, source2.name);

      assertSpyCall(writeSpy, 0, { args: [{ key: 'test', value: 'test', priority: 0 }] });
    });

    it('if default is not defined, throw error', () => {
      const container = new SettingsContainer();

      assertThrows(() => container.write({ key: 'test', value: 'test', priority: 0 }));
    });

    it('if source is not defined, throw error', () => {
      const container = new SettingsContainer();

      const source1 = { name: 'test1' } as SettingsSource;

      container.add(source1);

      assertThrows(() => container.write({ key: 'test', value: 'test', priority: 0 }, 'potato'));
    });
  });

  describe('.delete', () => {
    it('deletes from every source', () => {
      const container = new SettingsContainer();

      const deleteSpy = spy();

      const source1 = { delete: deleteSpy } as unknown as SettingsSource;
      const source2 = { delete: deleteSpy } as unknown as SettingsSource;

      container.add(source1);
      container.add(source2);

      container.delete('test');

      assertSpyCall(deleteSpy, 0, { args: ['test'] });
      assertSpyCall(deleteSpy, 1, { args: ['test'] });
    });

    it('deletes from source by name', () => {
      const container = new SettingsContainer();

      const deleteSpy = spy();

      const source1 = { name: 'test1' } as SettingsSource;
      const source2 = { name: 'test2', delete: deleteSpy } as unknown as SettingsSource;

      container.add(source1);
      container.add(source2);

      container.delete('test', source2.name);

      assertSpyCall(deleteSpy, 0, { args: ['test'] });
      assertSpyCalls(deleteSpy, 1);
    });
  });

  describe('.save', () => {
    it('saves to every source', async () => {
      const container = new SettingsContainer();

      const saveSpy = spy();

      const source1 = { save: saveSpy } as unknown as SettingsSource;
      const source2 = { save: saveSpy } as unknown as SettingsSource;

      container.add(source1);
      container.add(source2);

      await container.save();

      assertSpyCalls(saveSpy, 2);
    });

    it('saves to source by name', async () => {
      const container = new SettingsContainer();

      const saveSpy = spy();

      const source1 = { name: 'test1' } as SettingsSource;
      const source2 = { name: 'test2', save: saveSpy } as unknown as SettingsSource;

      container.add(source1);
      container.add(source2);

      await container.save(source2.name);

      assertSpyCalls(saveSpy, 1);
    });
  });
});
