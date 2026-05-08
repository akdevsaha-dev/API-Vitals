# Stage 1: Build Go Engine
FROM golang:1.23-alpine AS go-builder
WORKDIR /src
# Copy the entire monorepo to handle potential workspace deps or internal libs
COPY . .
# Build the engine binary
# Adjust path to your main.go - looking at your structure it is in services/engine/cmd/main.go
RUN go build -o /app/engine services/engine/cmd/main.go

# Stage 2: Node.js Base
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Stage 3: Build Node.js App
FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
# Install dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
# Build the API and all its internal workspace dependencies (@repo/*)
RUN npx turbo run build --filter=api

# Stage 4: Deploy (Prune)
FROM base AS deploy
WORKDIR /usr/src/app
COPY --from=build /usr/src/app /usr/src/app
# Prune the monorepo to only include the API and its production dependencies
RUN pnpm --filter api --prod deploy --legacy pruned

# Stage 5: Final Production Runner
FROM node:20-slim AS runner
WORKDIR /usr/src/app

# Copy the pruned Node.js application
COPY --from=deploy /usr/src/app/pruned ./

# Copy the Go engine binary from the go-builder stage
COPY --from=go-builder /app/engine ./engine
# Ensure the binary is executable
RUN chmod +x ./engine

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8000
EXPOSE 8000

# Start the application
CMD ["node", "dist/server.js"]
