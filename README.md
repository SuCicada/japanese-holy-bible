# japanese holy bible

npx prisma init
npx prisma generate 

npx dotenv -e .env.production.local -- npx prisma db pull
npx dotenv -e .env.production.local -- npx prisma generate


ALTER TABLE bible
ADD CONSTRAINT unique_combination UNIQUE (book, chapter, verse);


next build 
next start -p 3001


.env.production.local 用于build
.env用于run
其实内容都一样
