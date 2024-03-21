# japanese holy bible

npx prisma init

npx dotenv -e .env.production.local -- npx prisma db pull
npx prisma generate


ALTER TABLE bible
ADD CONSTRAINT unique_combination UNIQUE (book, chapter, verse);


next build 
next start -p 3001
