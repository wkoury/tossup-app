all: build

dev:
	yarn dev& cd client && yarn start

build:
	yarn install --production & \
		cd client && \
		yarn install --production && \
		yarn build
