import { NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";
import * as Prisma from "@prisma/client";
import { sql } from "@vercel/postgres";

export const dynamic = 'force-dynamic'
const prisma = new PrismaClient();


export async function GET(
  request: Request,
  // {params}: {params:{ book: string }}
) {
  let params = new URL(request.url).searchParams
  let book = params.get("book")
  console.log(book)
  let chapters = await sql`select DISTINCT chapter from bible WHERE book = ${book} ORDER BY chapter;`;
  let res: number[] = chapters.rows.map(row => row.chapter)

  // let res: BibleBooks = {
  // oldBooks: books.filter(book => book.id < 39),
  // newBooks: books.filter(book => book.id >= 39)
  // }
  return NextResponse.json<number[]>(res);
}
