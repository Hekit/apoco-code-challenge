# Use an official Node runtime as a parent image
FROM node:22

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock files first (for caching dependencies)
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of your source code
COPY . .

# Build the NestJS application
RUN yarn build

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run your app
CMD ["node", "dist/main.js"]
