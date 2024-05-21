# Fetching the minified node image on apline linux
FROM node:slim

# Declaring env
ENV NODE_ENV development

# Setting up the work directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copying all the files in our project
COPY . .

# Installing Typescript globally
RUN npm install typescript -g --legacy-peer-deps

# Installing pm2 globally
RUN npm install pm2 -g

# Installing dependencies
RUN npm run build

# Starting our application
CMD pm2 start process.yml && tail -f /dev/null

# Exposing server port
EXPOSE 3131