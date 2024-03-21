import { sql } from "@vercel/postgres";
import * as Prisma from "@prisma/client";
import { prisma } from "@/app/utils/db";

export default async function BookSelect() {

  // const {rows} = await sql`select * from books order by sort`;
  let oldBooks = await prisma.books.findMany({
    where: {
      id: {
        lt: 39
      }
    },
    orderBy: {
      sort: 'asc'
    }
  }) as Prisma.books[]
  let newBooks = await prisma.books.findMany({
    where: {
      id: {
        gte: 39
      }
    },
    orderBy: {
      sort: 'asc'
    }
  }) as Prisma.books[]

  return (<div>
    <h1>Books</h1>
    <ul>
      {oldBooks.map((book) => (
        <li key={book.id}>
          {book.short_name}
        </li>
      ))}
    </ul>
  </div>)
}
