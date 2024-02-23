// // no-config
// import { sql } from '@vercel/postgres';
//
// import { createPool } from '@vercel/postgres';
// import {NextResponse} from "next/server";
//
// export async function GET() {
//     // console.log(process.env)
//     // console.log(process.env.POSTGRES_URL)
//     // console.log(process.env.NEXT_PUBLIC_POSTGRES_URL)
//     // const pool = createPool({
//     //     connectionString: process.env.POSTGRES_URL,
//     //     user: process.env.POSTGRES_USER,
//     //     database: process.env.POSTGRES_DB,
//     //     password: process.env.POSTGRES_PASSWORD,
//     //     host: process.env.POSTGRES_HOST,
//     //     port: process.env.POSTGRES_PORT,
//     //     ssl: {
//     //         rejectUnauthorized: false
//     //     }
//     // });
// // const id = 100;
// // A one-shot query
//     const {rows} = await sql`SELECT * FROM bible order by book,chapter,verse`;
//
// // Multiple queries on the same connection (improves performance)
// // warning: Do not share clients across requests and be sure to release them!
// // const client = await sql.connect();
// // // const { rows } = await client.sql`SELECT * FROM users WHERE id = ${userId};`;
// // await client.sql`UPDATE users SET status = 'satisfied' WHERE id = ${userId};`;
// // client.release();
//     let result = rows
//     // console.log(result);
//     // res.status(200).json(result);
//     // return  {data: result}
//     return NextResponse.json(result);
// }
