import { debug } from "./src/debug.js";
import { Sreq } from "./src/Sreq.js";
import dotenv from "dotenv";

export default async (globalConfig, projectConfig) => {
  dotenv.config({ path: "./build/.env" });
  globalThis.debug = debug;
  globalThis.api = new Sreq(`${process.env.KOB_URL}/api`);
};
