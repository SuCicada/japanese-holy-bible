// // no-config
// import { sql } from '@vercel/postgres';
//
// import { createPool } from '@vercel/postgres';
// import {NextResponse} from "next/server";
// import {getServerSideProps} from "next/dist/build/templates/pages";
//
// export default async function handler(req:any, res:any) {
//     // console.log(req,res)
//     const {rows} = await sql`SELECT * FROM bible order by book,chapter,verse`;
//
//     let result = rows
//     // console.log(result);
//     // res.status(200).json(result);
//     // return  {data: result}
//     return NextResponse.json(result);
// }
//
