FROM node:8

# Install node/npm
RUN apt-get -y update  && \
        apt-get install -y curl && \
        curl -sL https://deb.nodesource.com/setup_6.x | bash - && \
        apt-get install -y nodejs

RUN npm set strict-ssl false
# Install app dependencies
COPY . package*.json

RUN npm install

EXPOSE 3000

CMD [ "npm", "start" ]

