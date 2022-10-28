import { assertEquals } from "deno/testing/asserts.ts";
import { getBrotherFile, getFolder } from "../../../src/modules/utils/file.ts";

Deno.test("#utils/file", async utils => {

  await utils.step("getBrotherFile", () => {
    const path = "/home/user/project/file.ts";
    const name = "file.json";
    const result = getBrotherFile(path, name);

    assertEquals(result, "/home/user/project/file.json");
  });

  await utils.step("getFolder", () => {
    const path = "/home/user/project/file.ts";
    const result = getFolder(path);

    assertEquals(result, "/home/user/project");
  });

});
