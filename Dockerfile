FROM node:16

WORKDIR /usr/src/cache

COPY package.json .

RUN npm install

COPY . .

ENV WORKDIR=/usr/data
ENV PORT=8080
EXPOSE 8080

CMD [ "node", "index.js" ]
