FROM node:10

WORKDIR /usr/src/app

RUN apt-get update && \
    apt-get -y install gcc g++ python && \
    rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]
