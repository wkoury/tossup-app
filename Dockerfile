FROM node:14.17.0

RUN npm i -g --force yarn

WORKDIR /app

COPY . .

RUN make build

EXPOSE 8085

ENTRYPOINT ["node", "server.js"]
