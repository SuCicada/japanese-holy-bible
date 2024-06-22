// import { sql } from '@vercel/postgres';

import path from "path";

import dotenv from "dotenv";

import {Bible} from "@/app/bible/data";
import {getJapaneseFurigana} from "@/app/utils/service";
import {Client} from "pg";

import {Prisma, PrismaClient} from "@prisma/client";

let env_file = path.join(__dirname, '../.env.production.local');
dotenv.config({path: env_file});
console.log(process.env.POSTGRES_URL);
let start = new Date().getTime();
const prisma = new PrismaClient();
import {sql} from "@/app/utils/db";

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
     console.log("start to get furigana for ", row.text)
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
                , reading  = ${row.text}
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
  for (let bible of bibles) {
    console.log(bible)
    try {
      let res = await prisma.bible.create({data: bible})
      console.log(res)
    } catch (e) {
      console.error(e);
    }
  }
  // if (bibles.length > 0) {
  // }
}

(async () => {
  let book = `
  エフェソの信徒への手紙 6
  `.trim()
  let multi_words = ` 
   10最後に言う。主に依り頼み、その偉大な力によって強くなりなさい。 11悪魔の策略に対抗して立つことができるように、神の武具を身に着けなさい。 12わたしたちの戦いは、血肉を相手にするものではなく、支配と権威、暗闇の世界の支配者、天にいる悪の諸霊を相手にするものなのです。 13だから、邪悪な日によく抵抗し、すべてを成し遂げて、しっかりと立つことができるように、神の武具を身に着けなさい。 14立って、真理を帯として腰に締め、正義を胸当てとして着け、 15平和の福音を告げる準備を履物としなさい。 16なおその上に、信仰を盾として取りなさい。それによって、悪い者の放つ火の矢をことごとく消すことができるのです。 17また、救いを兜としてかぶり、霊の剣、すなわち神の言葉を取りなさい。 18どのような時にも、“霊”に助けられて祈り、願い求め、すべての聖なる者たちのために、絶えず目を覚まして根気よく祈り続けなさい。 
 `
  let chapter = parseInt(book.split(' ')[1])
  book = book.split(' ')[0]
  await split_multi(book, chapter, multi_words);
  await import_furigana();
})();
