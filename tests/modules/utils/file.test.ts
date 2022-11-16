import { assertEquals } from "deno/testing/asserts.ts";
import { getBrotherFile, getFolder, formatWindowsImport } from "../../../src/modules/utils/file.ts";

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

  await utils.step("formatWindowsImport", () => {
    const path = "C:\\Users\\user\\project\\file.ts";
    const result = formatWindowsImport(path);

    assertEquals(result, "/Users/user/project/file.ts");
  });

});
