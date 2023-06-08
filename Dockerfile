FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# COPY package*.json ./
# Bundle app source
COPY . .

RUN npm install

# Expose port 3000
EXPOSE 3000

# Build common library
RUN npm run build -w clan.events.common

# Build app
RUN npm run build -w clan.events.api

# Start app
CMD [ "npm", "run", "start:prod", "-w", "clan.events.api" ]