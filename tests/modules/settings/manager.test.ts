import { Section, SettingsManager } from "../../../src/modules/settings.ts";
import { assertEquals, assertInstanceOf } from "deno/testing/asserts.ts";
import { buildMockSettingsManager } from "./manager.mock.ts";


Deno.test('#SettingsManager', async steps => {

  await steps.step('.section', async sectionSteps => {
    await sectionSteps.step('return the section', () => {
      const manager = new SettingsManager({});

      const section = manager.section();

      assertInstanceOf(section, Section);
    });

    await sectionSteps.step('return the same section', () => {
      const manager = new SettingsManager({});

      const section1 = manager.section();
      const section2 = manager.section();

      assertEquals(section1, section2);
    });
  });

  await steps.step('.get', async getSteps => {
    await getSteps.step('return the main setting unit', () => {
      const { settingsManager } = buildMockSettingsManager({
        globalSettings: { p: 'global-settings' },
        localSettings: { p: 'local-settings' },
        targetSettings: { p: 'target-settings' },
      })
      settingsManager.priority.setOrder(['global', 'local', 'target']);

      const unit = settingsManager.get('p');

      assertEquals(unit, {
        key: 'p',
        value: 'global-settings',
        target: 'global',
        OS: 'none',
      });
    });

    await getSteps.step('fallback to second setting unit', () => {
      const { settingsManager } = buildMockSettingsManager({
        globalSettings: { z: 'global-settings' },
        localSettings: { p: 'local-settings' },
        targetSettings: { p: 'target-settings' },
      })
      settingsManager.priority.setOrder(['global', 'local', 'target']);

      const unit = settingsManager.get('p');

      assertEquals(unit, {
        key: 'p',
        value: 'local-settings',
        target: 'local',
        OS: 'none',
      });
    });

    await getSteps.step('fallback to third setting unit', () => {
      const { settingsManager } = buildMockSettingsManager({
        globalSettings: { z: 'global-settings' },
        localSettings: { z: 'local-settings' },
        targetSettings: { p: 'target-settings' },
      })
      settingsManager.priority.setOrder(['global', 'local', 'target']);

      const unit = settingsManager.get('p');

      assertEquals(unit, {
        key: 'p',
        value: 'target-settings',
        target: 'target',
        OS: 'none',
      });
    });
  });
});
