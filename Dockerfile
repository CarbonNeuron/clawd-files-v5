FROM oven/bun:1 AS build
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
ARG BUILD_COMMIT=unknown
ARG BUILD_COMMIT_SHORT=unknown
ENV BUILD_COMMIT=$BUILD_COMMIT
ENV BUILD_COMMIT_SHORT=$BUILD_COMMIT_SHORT
RUN bun run build

FROM oven/bun:1-alpine AS runtime
WORKDIR /app
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
EXPOSE 3000
CMD ["bun", "server.js"]
