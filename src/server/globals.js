import * as Path from "node:path";
import * as URL from "node:url";
import { debug } from "/src/debug.js";
import { db } from '/src/db.js';

globalThis.__dirname = Path.dirname(URL.fileURLToPath(import.meta.url));
globalThis.debug = debug;
globalThis.db = db;
