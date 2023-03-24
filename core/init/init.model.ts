import type { IServices } from "../../modules/services.ts";

export type { IServices } from "../../modules/services.ts";
export type InitMod = (services: IServices) => void | Promise<void>;
