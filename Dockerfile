FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json prisma.config.ts ./
COPY prisma ./prisma
COPY src ./src
COPY docs ./docs

RUN npm run prisma:generate
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY prisma ./prisma
COPY docs ./docs
COPY --from=builder /app/dist ./dist

EXPOSE 4000

CMD ["sh", "-c", "npm run prisma:generate && npm run prisma:deploy && npm run start"]
