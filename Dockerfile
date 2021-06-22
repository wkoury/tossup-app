FROM node:14.17.0

RUN npm i -g --force yarn pm2

WORKDIR /app

COPY . .

RUN make build

EXPOSE 8085

ENTRYPOINT ["pm2-runtime", "server.js"]
