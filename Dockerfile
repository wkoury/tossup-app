FROM node:14.18.0

RUN apt-get update && \
	apt-get -y upgrade && \
	apt-get -y install \
	chromium

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium

RUN npm i -g --force yarn pm2
WORKDIR /app
COPY . .
RUN make build
RUN make prune-dev-dependencies

EXPOSE 8085

ENTRYPOINT ["pm2-runtime", "server.js"]
