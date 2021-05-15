all: build

dev:
	yarn dev& cd client && yarn start

build:
	yarn
	cd client
	yarn
	yarn build
