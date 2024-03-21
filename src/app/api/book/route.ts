import {NextResponse} from "next/server";

import {PrismaClient} from "@prisma/client";
import * as Prisma from "@prisma/client";

// export const dynamic = 'force-dynamic'
const prisma = new PrismaClient();

export type BibleBooks = {
  oldBooks: Prisma.books[],
  newBooks: Prisma.books[]
}

export async function GET(
  request: Request,
) {
  let books = await prisma.books.findMany({
    orderBy: {
      sort: 'asc'
    }
  }) as Prisma.books[]
  
  let res : BibleBooks = {
    oldBooks: books.filter(book => book.id < 39),
    newBooks: books.filter(book => book.id >= 39)
  }

  return NextResponse.json<BibleBooks>(res);
}
