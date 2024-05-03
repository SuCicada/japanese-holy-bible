
vercel-env-update:
	node ./scripts/vercel-env-update.js

import_db:
	ts-node -r tsconfig-paths/register --project tsconfig.scripts.json scripts/import_db.ts

prisma-update:
	npx dotenv -e .env.production.local -- npx prisma db pull && npx prisma generate
