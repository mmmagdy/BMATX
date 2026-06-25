# syntax=docker/dockerfile:1

# ─────────────────────────────────────────────────────────────────────────────
# BMatx portal — production image (Next.js 15 standalone output)
# Multi-stage: deps → builder → runner. Final image ships only the standalone
# server bundle + static assets, runs as a non-root user.
# ─────────────────────────────────────────────────────────────────────────────

FROM node:20-alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# ---- install dependencies (cached on lockfile change) ----
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ---- build the app ----
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---- minimal runtime image ----
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# public assets + the self-contained server bundle + static chunks
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

# server.js is emitted by Next's standalone output
CMD ["node", "server.js"]
