# Install dependencies and build the application
FROM node:22 AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

# Run unit tests
FROM builder AS tester
RUN yarn test

# Run end-to-end tests
FROM builder AS e2e
CMD ["yarn", "test:e2e"]

# Image for production
FROM node:22 AS production
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/src/main.js"]

# Seeder – runs the seed script
FROM production AS seeder
CMD ["node", "dist/seeds/seed.js"]
