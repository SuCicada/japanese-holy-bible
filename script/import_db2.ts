// import { sql } from '@vercel/postgres';
import {sql} from "@vercel/postgres";

import path from "path";

import dotenv from "dotenv";

import {Bible} from "@/app/bible/data";
import {getJapaneseFurigana} from "../src/app/utils/service";

let env_file = path.join(__dirname, '../.env.development.local');
dotenv.config({path: env_file});
let start = new Date().getTime();
(async () => {
    const {rows} = await sql`SELECT *
                             FROM bible`;
    for (const row of (rows as Bible[])) {
        if (row.furigana) {
            continue;
        }
        // row = row as Bible
        // row as Bible
        const data = await getJapaneseFurigana(row.text)
        let res = ""
        for (let item of data["data"]) {
            const [character, type, hiragana, katakana] = item;
            switch (type) {
                case 1:
                    res += `{{${character}|${hiragana}}}`
                    break;
                default:
                    res += character;
            }
        }
        console.log(res);
        await sql`UPDATE bible
                  SET furigana = ${res}
                  WHERE id = ${row.id}`;
    }
    // console.log(rows);
    console.log(`Time: ${new Date().getTime() - start}ms`);
})();
