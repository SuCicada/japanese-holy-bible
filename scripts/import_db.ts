// import { sql } from '@vercel/postgres';
import {sql} from "@vercel/postgres";

import path from "path";

import dotenv from "dotenv";

import {Bible} from "@/app/bible/data";
import {getJapaneseFurigana} from "@/app/utils/service";
import {Client} from "pg";

import {Prisma, PrismaClient} from "@prisma/client";

let env_file = path.join(__dirname, '../.env.development.local');
dotenv.config({path: env_file});
let start = new Date().getTime();
const prisma = new PrismaClient();

async function import_furigana() {
  const {rows} = await sql`SELECT *
                           FROM bible
                           where furigana is null`;
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
}


async function split_multi(book: string, chapter: number, multi_words: string) {
  // let book = "ヨハネによる福音書";
  // let chapter = 1;
  // let multi_words = `1初めに言があった。言は神と共にあった。言は神であった。 2この言は、初めに神と共にあった。 3万物は言によって成った。成ったもので、言によらずに成ったものは何一つなかった。 4言の内に命があった。命は人間を照らす光であった。`

  let bibles: Bible[] = []
  let words = Array.from(multi_words.trim().matchAll(/(\d+)(\W+)/g))
  for (let w of words) {
    let verse = parseInt(w[1])
    let text = w[2].trim()
    bibles.push({book, chapter, verse, text})

  }
  // let verse;
  // let verse2;
  // let m = multi_words.trim().match(/^(\d+)/)
  // if (m) {
  //   verse = parseInt(m[1])
  //   while (true) {
  //     verse2 = verse + 1
  //     let a = multi_words.indexOf(verse.toString()) + verse.toString().length
  //     let b = multi_words.indexOf(verse2.toString())
  //     if (b === -1) {
  //       b = multi_words.length
  //     }
  //     let text = multi_words.slice(a, b).trim()
  //     console.log(text)
  //     bibles.push({book, chapter, verse, text})
  //
  //     verse = verse2
  //     if (b === multi_words.length) {
  //       break
  //     }
  //   }
  // }

  if (bibles.length > 0) {
    try {
      let res = await prisma.bible.createMany({
        data: bibles
      });
      console.log(res)
    } catch (e) {
      console.error(e);
    }
  }
}

(async () => {
  let book = "マタイによる福音書 4";
  let multi_words = ` 
  1さて、イエスは悪魔から誘惑を受けるため、“霊”に導かれて荒れ野に行かれた。 
  3すると、誘惑する者が来て、イエスに言った。「神の子なら、これらの石がパンになるように命じたらどうだ。」 4イエスはお答えになった。
「『人はパンだけで生きるものではない。
神の口から出る一つ一つの言葉で生きる』
と書いてある。」
  
  `
  let chapter = parseInt(book.split(' ')[1])
  book = book.split(' ')[0]
  await split_multi(book, chapter, multi_words);
  await import_furigana();
})();
