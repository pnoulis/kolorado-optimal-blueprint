#!/bin/make

SHELL := /bin/bash
.DEFAULT_GOAL := all

all:
	node ./index.js

colon = :


docker: docker-run-server docker-run-website

docker-run-website: docker-image-website
	docker run --detach --publish 3000:3000 \
	--mount type=bind,source="$$(pwd)",target=/srv node:website

docker-run-server: docker-image-server
	docker run --detach --publish 8080:8080 \
	--mount type=bind,source="$$(pwd)",target=/src node:server &

docker-image-website:
	docker build --tag node$(colon)website \
	--build-arg package=website -f Dockerfile .

docker-image-server:
	docker build --tag node$(colon)server \
	--build-arg package=server -f Dockerfile .
