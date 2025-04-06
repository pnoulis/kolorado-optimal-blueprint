import sqlite from "better-sqlite3";

let db;

if (!db) db = new sqlite(process.env.DB_PATH);

export { db };
