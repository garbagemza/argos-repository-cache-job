FROM arm64v8/node:14.19-alpine3.14
WORKDIR /app
COPY package.json package-lock.json ./

RUN npm ci --prod

COPY . .

CMD [ "node", "index.js" ]