import { ISecureShell } from "./model.ts";
import { SecureShell } from "./ssh.ts";
import { LOGGER_FACTORY } from "../logger/service.ts";
import { CONFIG_HANDLER, CONFIG_PROVIDER } from "../config/service.ts";
import { FILE_SYSTEM } from "../file-system/services.ts";
import { createToken, declareService } from "../container/mod.ts";

export const SSH = createToken<ISecureShell>("ssh");

export const sshService = declareService(
  SSH,
  SecureShell,
  CONFIG_PROVIDER,
  CONFIG_HANDLER,
  LOGGER_FACTORY,
  FILE_SYSTEM
);
