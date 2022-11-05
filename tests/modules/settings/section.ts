import { ISettingsManager, Section, SettingUnit } from "../../../src/modules/settings.ts";
import { assertEquals } from "deno/testing/asserts.ts";
import { mock } from "../../mock.ts";

type ITestSettings = {
  p: string;
  q: number;
};

Deno.test('#Section', async steps => {
  await steps.step('return setting value', () => {
    const mockManager = mock<ISettingsManager>()
      .stub('get', () => ({ value: 'q' }) as unknown as SettingUnit)
      .get();

    const section = new Section<ITestSettings>(mockManager);

    assertEquals(section.value.p, 'q');
  });

  await steps.step('.set', async setSteps => {

    await setSteps.step('set the value', async () => {
      const mockManager = mock<ISettingsManager>()
        .stub('get', () => ({ value: 'q' }) as unknown as SettingUnit)
        .stub('set', () => { })
        .stub('save', async () => { });

      const section = new Section<ITestSettings>(mockManager.get());

      await section.set('p', 'r');

      mockManager.assertWasCalledWith('set', { value: 'r' });
    });

    await setSteps.step('save the value', async () => {
      const mockManager = mock<ISettingsManager>()
        .stub('get', () => ({ value: 'q' }) as unknown as SettingUnit)
        .stub('set', () => { })
        .stub('save', async () => { });

      const section = new Section<ITestSettings>(mockManager.get());

      await section.set('p', 'r');

      mockManager.assertWasCalled('save');
    });

  });

  await steps.step('.delete', async deleteSteps => {

    await deleteSteps.step('delete the value', async () => {
      const mockManager = mock<ISettingsManager>()
        .stub('get', () => ({ value: 'q' }) as unknown as SettingUnit)
        .stub('delete', () => { })
        .stub('save', async () => { });

      const section = new Section<ITestSettings>(mockManager.get());

      await section.delete('p');

      mockManager.assertWasCalledWith('delete', { value: 'q' });
    });

    await deleteSteps.step('save the value', async () => {
      const mockManager = mock<ISettingsManager>()
        .stub('get', () => ({ value: 'q' }) as unknown as SettingUnit)
        .stub('delete', () => { })
        .stub('save', async () => { });

      const section = new Section<ITestSettings>(mockManager.get());

      await section.delete('p');

      mockManager.assertWasCalled('save');
    });
  });

});
