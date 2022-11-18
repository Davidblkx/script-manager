import { assertEquals } from "deno/testing/asserts.ts";
import { getBrotherFile, getFolder, findPathTo } from "../../../src/modules/utils/file.ts";
import { SEP } from 'deno/path/mod.ts';

Deno.test("#utils/file", async utils => {

  await utils.step(".getBrotherFile", () => {
    const path = "/home/user/project/file.ts";
    const name = "file.json";
    const result = getBrotherFile(path, name);

    assertEquals(result, "/home/user/project/file.json".replaceAll('/', SEP));
  });

  await utils.step(".getFolder", () => {
    const path = "/home/user/project/file.ts";
    const result = getFolder(path);

    assertEquals(result, "/home/user/project");
  });

  await utils.step(".findPathTo", async findPathSteps => {
    await findPathSteps.step("find relative path in unix", () => {
      const path = "/home/user/project/file.ts";
      const src = "/home/user/data/cwd";
      const result = findPathTo(path, src);

      assertEquals(result, "../../project/file.ts".replaceAll('/', SEP));
    });

    if (Deno.build.os === "windows") {
      await findPathSteps.step("find relative path in windows", () => {
        const path = "C:\\Users\\user\\project\\file.ts";
        const src = "C:\\Users\\user\\data\\cwd";
        const result = findPathTo(path, src);

        assertEquals(result, "..\\..\\project\\file.ts");
      });
    }
  });

});
