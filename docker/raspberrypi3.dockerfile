FROM balenalib/raspberrypi3-alpine-node:14.19
WORKDIR /app
COPY package.json package-lock.json ./

RUN npm ci --prod

COPY . .

CMD [ "node", "index.js" ]