// no-config
import {NextResponse} from "next/server";
import {getServerSideProps} from "next/dist/build/templates/pages";
import {NextApiResponse} from "next";

// export default async function handler(req:any, res:NextApiResponse) {
//     // console.log(req,res)
//     const {rows} = await sql`SELECT * FROM bible order by book,chapter,verse`;
//
//     let result = rows
//     // console.log(result);
//     // res.status(200).json(result);
//     // return  {data: result}
//     return res.json(result);
// }
//
