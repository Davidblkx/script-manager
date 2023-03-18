import { describe, it } from "$deno/testing/bdd.ts";
import { join, toFileUrl } from "$deno/path/mod.ts";
import { FileSystem } from "../../../modules/file-system/mod.ts";
import { assertEquals } from "$deno/testing/asserts.ts";

describe("FileSystem/file-system", () => {
  describe(".getURL", () => {
    it("returns the url for a relative path", () => {
      const subject = new FileSystem();

      const part = "./file.txt";
      const folder = "./folder";
      const expected = toFileUrl(join(Deno.cwd(), folder, part)).pathname;

      const result = subject.getURL(part, folder);

      assertEquals(result.pathname, expected);
    });

    it("returns the url for an absolute path", () => {
      const subject = new FileSystem();

      const part = "./file.txt";
      const folder = "/folder";

      const result = subject.getURL(part, folder);

      assertEquals(result.pathname, "/folder/file.txt");
    });
  });
});
