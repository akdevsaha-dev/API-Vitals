# Stage 1: Build the Go binary (Engine)
FROM golang:1.22-alpine AS go-build
WORKDIR /src
# Copy go.mod first for better caching
COPY services/engine/go.mod ./
RUN go mod download
# Copy the rest of the engine source
COPY services/engine/ ./
# Build the binary - static linking to ensure it runs in the slim node image
RUN CGO_ENABLED=0 GOOS=linux go build -o /engine .

# Stage 2: Base Node.js image
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Stage 3: Build Node.js worker
FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm --filter worker build

# Stage 4: Prune for production
FROM base AS deploy
WORKDIR /usr/src/app
COPY --from=build /usr/src/app /usr/src/app
RUN pnpm --filter worker --prod deploy pruned

# Stage 5: Final hybrid runner
FROM node:20-slim AS runner
WORKDIR /usr/src/app

# Copy the pruned Node.js worker
COPY --from=deploy /usr/src/app/pruned ./

# Copy the Go engine binary from Stage 1
COPY --from=go-build /engine /usr/local/bin/engine
RUN chmod +x /usr/local/bin/engine

# Set environment variables
ENV NODE_ENV=production

# The worker can now invoke the 'engine' binary as a subprocess if needed
CMD ["node", "dist/index.js"]
