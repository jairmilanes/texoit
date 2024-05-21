# Fetching the minified node image on apline linux
FROM node:20-alpine

# Declaring env
ENV NODE_ENV production

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json .

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build the Gatsby site
RUN npm run build

# Start the Gatsby server
CMD ["npm", "run", "serve"]

# Expose the port the app runs on
EXPOSE 9000
