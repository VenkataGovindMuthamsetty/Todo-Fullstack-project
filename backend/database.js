const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require('sqlite');

const dbPath = path.join(__dirname, "database.sqlite");



const intiliazeDatabase = async () => {
    let db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    await db.run(`
        CREATE TABLE IF NOT EXISTS tasks(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT NOT NULL,
        completed BOOLEAN DEFAULT FALSE)
        
    `);

    return db
}
module.exports = {intiliazeDatabase}