
FROM NODE:8

# Install MySQL Driver to connect to Nodejs
RUN npm install mysql

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json /usr/src/app/

RUN npm install phantomjs-prebuilt

RUN npm install

# Bundle app source
COPY . /usr/src/app

EXPOSE 3000

HEALTHCHECK --interval=5s --timeout=10s --retries=3 CMD curl -sS http://35.178.213.196:3000 || exit 1

CMD [ "npm", "start" ]
