# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Install dependencies
RUN npm install --workspaces --include-workspace-root

# Copy source code
COPY . .

# Build frontend
RUN npm run build --workspace=frontend

# Build backend
RUN npm run build --workspace=backend

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Copy built files
COPY --from=builder --chown=nextjs:nodejs /app/frontend/dist ./frontend/dist
COPY --from=builder --chown=nextjs:nodejs /app/backend/dist ./backend/dist
COPY --from=builder --chown=nextjs:nodejs /app/backend/node_modules ./backend/node_modules
COPY --from=builder --chown=nextjs:nodejs /app/backend/package.json ./backend/package.json
COPY --from=builder --chown=nextjs:nodejs /app/backend/prisma ./backend/prisma

USER nextjs

EXPOSE 3001 5173

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start both services
CMD ["sh", "-c", "cd /app/backend && node dist/main.js & cd /app/frontend && npx serve -s dist -l 5173"]