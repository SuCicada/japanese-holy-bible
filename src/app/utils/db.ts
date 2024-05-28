import {Prisma, PrismaClient} from "@prisma/client";
import {QueryResult, QueryResultRow} from "pg";
import {Pool} from 'pg';
// import {Prisma} from "prisma-client-09a8d34f990ac5ec4d39c8b148141ddf39f6b0329786103087f17284234040ed/index";
export const prisma = new PrismaClient();


const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
})

export async function sql<O extends QueryResultRow>(
  strings: TemplateStringsArray,
  ...values: Primitive[]
): Promise<QueryResult<O>> {
  const [query, params] = sqlTemplate(strings, ...values);

  // @ts-ignore
  const res = await pool.query(query, params);

  // @ts-ignore
  return res as unknown as Promise<QueryResult<O>>;
}

export type Primitive = string | number | boolean | undefined | null;

export function sqlTemplate(
  strings: TemplateStringsArray,
  ...values: Primitive[]
): [string, Primitive[]] {
  if (!isTemplateStringsArray(strings) || !Array.isArray(values)) {
    throw new Error("It looks like you tried to call `sql` as a function. Make sure to use it as a tagged template.\n\tExample: sql`SELECT * FROM users`, not sql('SELECT * FROM users')");
  }

  let result = strings[0] ?? '';

  for (let i = 1; i < strings.length; i++) {
    result += `$${i}${strings[i] ?? ''}`;
  }

  return [result, values];
}

function isTemplateStringsArray(
  strings: unknown,
): strings is TemplateStringsArray {
  return (
    Array.isArray(strings) && 'raw' in strings && Array.isArray(strings.raw)
  );
}
