# Avoid "moving target" image by omitting tag or using "latest" and define a tag instead
FROM node:8

# Create app directory
WORKDIR /home/node/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# building code for production
RUN npm install --only=production

# Bundle app source
COPY . .

# Define env var PORT with default (which can be overriten when starting the container)
ENV PORT=8080

# Expose the port defined as env var PORT to allow access to the app
EXPOSE $PORT
CMD [ "npm", "start" ]

# Avoid running as root
USER node