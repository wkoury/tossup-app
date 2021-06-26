IMAGE="tossup"

all: build

.PHONY: dev build build-dev docker-build docker-run docker-run-prod deploy

dev:
	yarn dev& cd client && yarn start

build:
	cp client/src/App.css public/style.css && \
	cp client/src/index.css public/index.css && \
	yarn install --production --frozen-lockfile & \
		cd client && \
		yarn install --production --frozen-lockfile && \
		yarn build

build-dev:
	yarn & \
	cd client && yarn

docker-build:
	docker build --no-cache -t $(IMAGE) .

docker-run:
	docker run -it --rm -p 8085:8085 $(IMAGE)

docker-run-prod:
	docker run -d --restart=always -p 8085:8085 $(IMAGE)

deploy:
	sh scripts/deploy.sh
