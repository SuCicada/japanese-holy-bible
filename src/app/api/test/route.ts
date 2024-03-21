// no-config
import { sql } from '@vercel/postgres';

import { createPool } from '@vercel/postgres';
import {NextResponse} from "next/server";
export const dynamic = 'force-dynamic'
// async function getServerSideProps() {
  // const result = await db.query.documents.findFirst();

  // return { props: { data: result } };
  // return rows;
// }

export async function GET() {

// Multiple queries on the same connection (improves performance)
// warning: Do not share clients across requests and be sure to release them!
// const client = await sql.connect();
// // const { rows } = await client.sql`SELECT * FROM users WHERE id = ${userId};`;
// await client.sql`UPDATE users SET status = 'satisfied' WHERE id = ${userId};`;
// client.release();
    const {rows} = await sql`SELECT * FROM test`;
    // let result = await getServerSideProps()
    let result = rows
    console.log(result);
    // res.status(200).json(result);
    // return  {data: result}
    return NextResponse.json(result);
}
