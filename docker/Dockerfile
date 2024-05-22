
# Multistaged build
# 1. Dependency cache
# Install dependencies only when needed
FROM node:18-alpine as deps
# ENV NODE_PATH ./src
WORKDIR /app
ENV NODE_ENV $node_env

RUN apk add --no-cache libc6-compat
# Ne treba package-lock.json* sa yarn-om
COPY package.json ./
RUN yarn install --frozen-lockfile

# 2. Builder
# Rebuild the source code only when needed
FROM node:18-alpine as builder
WORKDIR /app
ENV NODE_ENV $node_env

COPY next.config.js ./next.config.js
COPY package.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN yarn build

# 3. Runner
FROM node:18-alpine as runner
WORKDIR /app
# Remove .env file since it will be used to override docker settings
# RUN rm /app/.env
ENV NODE_ENV $node_env

RUN adduser --system --uid 1001 nextjs
RUN addgroup --system --gid 1001 nodejs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./standalone/.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/public ./standalone/public
# wrong  https://github.com/vercel/next.js/tree/canary/examples/with-docker
# good https://github.com/vercel/next.js/issues/50931
# .next/static to standalone/.next/static and to copy the public folder to standalone/public.

USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD HOSTNAME="0.0.0.0" node server.js
# CMD ["node", "server.js"]
