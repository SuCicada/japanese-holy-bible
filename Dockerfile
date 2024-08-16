FROM node:18-alpine as base
FROM base AS builder

WORKDIR /app

# 复制 package.json 和 yarn.lock 以利用 Docker 缓存
COPY package.json yarn.lock ./

# 安装依赖
# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# 复制剩余的项目文件
COPY . .
#COPY .env.production.local .env

RUN yarn build


FROM base AS runner
WORKDIR /app

COPY --from=builder /app/public ./public
#COPY --from=builder /app/package.json /app/yarn.lock ./
#COPY --from=builder /app/.next ./.next
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
#COPY prisma ./prisma/

EXPOSE 9084

ENV NODE_ENV production
ENV PORT 9084

CMD ["node", "server.js"]
