ifeq ($(RUNTIME_ENVIRONMENT), production)
	COMPOSE = sudo docker-compose -f docker-compose.yml -f docker-compose.prod.yml
else
	COMPOSE = docker-compose -f docker-compose.yml -f docker-compose.dev.yml
endif

SERVICE = api

build:
	$(COMPOSE) build

up:
	$(COMPOSE) up

up-d:
	$(COMPOSE) up -d --build

up-f:
	$(COMPOSE) up --build

down:
	$(COMPOSE) down
exec:
	$(COMPOSE) exec $(SERVICE) bash

