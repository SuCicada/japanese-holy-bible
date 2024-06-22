import {NextResponse} from "next/server";

import {PrismaClient} from "@prisma/client";
import * as Prisma from "@prisma/client";
import {sql} from "@/app/utils/db";
export const dynamic = "force-dynamic";

// export const dynamic = 'force-dynamic'
const prisma = new PrismaClient();
export type BibleBooks = {
  oldBooks: Prisma.books[],
  newBooks: Prisma.books[]
}
export interface BookChapters {
  [key: string]: number[]
}
export type BibleBookChapters = {
  books: BibleBooks,
  book_chapters: BookChapters
}

export async function GET(
  request: Request,
) {
  let bookChapters = await sql`
    SELECT json_build_object(book,
--     json_agg(chapter)
                             COALESCE(json_agg(chapter) FILTER (WHERE chapter IS NOT NULL), '[]'::json)
           ) AS book_chapters
    FROM (SELECT distinct bible.chapter   as chapter,
                          books.long_name as book,
                          books.sort      as sort
          FROM books
                 left join bible on bible.book = books.long_name
          ORDER BY sort, bible.chapter) subquery
    GROUP BY book, sort
    ORDER BY sort
  `
  let book_chapters = bookChapters.rows.reduce((map, row) => {
    let [book, chapter] = Object.entries(row.book_chapters)[0]
    map[book] = chapter
    return map
  }, {});

  // console.log(bookChapters.rows)

  let books = await prisma.books.findMany({
    orderBy: {
      sort: 'asc'
    }
  }) as Prisma.books[]

  let bibleBooks: BibleBooks = {
    oldBooks: books.filter(book => book.id < 39),
    newBooks: books.filter(book => book.id >= 39)
  }
  let res: BibleBookChapters = {
    books: bibleBooks,
    book_chapters
  }
  return NextResponse.json<BibleBookChapters>(res);
}
