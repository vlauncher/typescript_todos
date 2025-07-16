# ---- Base Node Image ----
FROM node:22-alpine AS base
WORKDIR /app

# ---- Dependencies ----
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# ---- Development ----
FROM deps AS development
ENV NODE_ENV=development
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "run", "dev"]

# ---- Production ----
FROM deps AS build
ENV NODE_ENV=production
COPY . .
RUN npm run build

FROM node:22-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/swagger.yaml ./swagger.yaml
EXPOSE 5000
CMD ["node", "dist/server.js"] 