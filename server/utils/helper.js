import fs from "fs/promises";

let dbPath = "/home/rayyan/TodoExpressv2/server/data.json";

async function readDB()
{
    try {
        let DB = await fs.readFile(dbPath, "utf-8");
        return JSON.parse(DB);
    } catch (error) {
        console.log(error);
    }
}

async function writeDB(content)
{
    try {
        await fs.writeFile(dbPath, JSON.stringify(content, null, 2));
    } catch (error) {
        console.log(error);
    }
}

export {readDB, writeDB};