import { Section, SettingsManager } from "../../../src/modules/settings.ts";
import { assertEquals, assertInstanceOf } from "deno/testing/asserts.ts";


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

});
