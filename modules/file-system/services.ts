import { createToken, declareService } from "../container/mod.ts";
import { LOGGER_FACTORY } from "../logger/service.ts";
import { IFileSystem } from "./model.ts";
import { FileSystem } from "./file-system.ts";

export const FILE_SYSTEM = createToken<IFileSystem>("file_system");

export const fileSystemService = declareService(
  FILE_SYSTEM,
  FileSystem,
  LOGGER_FACTORY
);
