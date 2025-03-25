import * as Path from "node:path";
import * as URL from "node:url";
import { debug } from "/src/common/debug.js";

globalThis.__dirname = Path.dirname(URL.fileURLToPath(import.meta.url));
// globalThis.PUBLICDIR = process.env.PUBLICDIR;
// globalThis.STATEDIR = process.env.STATEDIR;
globalThis.debug = debug;
