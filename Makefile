build:
	docker compose -f local.yml up --build -d --remove-orphans

build-prod:
	docker compose -f docker-compose.production.yml up --build -d --remove-orphans

check-django-deploy:
	docker compose -f docker-compose.production.yml run --rm api python manage.py check --deploy

up:
	docker compose -f local.yml up -d

up-prod:
	docker compose -f docker-compose.production.yml up -d

down:
	docker compose -f local.yml down

down-prod:
	docker compose -f docker-compose.production.yml down

arch-config:
	docker compose -f local.yml config

arch-config-prod:
	docker compose -f docker-compose.production.yml config

clean:
	docker system prune -a -f

show-logs:
	docker compose -f local.yml logs

show-logs-prod:
	docker compose -f docker-compose.production.yml logs

show-logs-api:
	docker compose -f local.yml logs api

show-logs-api-prod:
	docker compose -f docker-compose.production.yml logs api

makemigrations:
	docker compose -f local.yml run --rm api python manage.py makemigrations

makemigrations-prod:
	docker compose -f docker-compose.production.yml run --rm api python manage.py makemigrations

migrate:
	docker compose -f local.yml run --rm api python manage.py migrate

migrate-prod:
	docker compose -f docker-compose.production.yml run --rm api python manage.py migrate

collectstatic:
	docker compose -f local.yml run --rm api python manage.py collectstatic --no-input --clear

collectstatic-prod:
	docker compose -f docker-compose.production.yml run --rm api python manage.py collectstatic --no-input --clear

superuser:
	docker compose -f local.yml run --rm api python manage.py createsuperuser

superuser-prod:
	docker compose -f docker-compose.production.yml run --rm api python manage.py createsuperuser

down-v:
	docker compose -f local.yml down -v

down-v-prod:
	docker compose -f docker-compose.production.yml down -v

flush:
	docker compose -f local.yml run --rm api python manage.py flush

flush-prod:
	docker compose -f docker-compose.production.yml run --rm api python manage.py flush

volume:
	docker volume inspect src_local_postgres_data

volume-prod:
	docker volume inspect src_prod_postgres_data

network-inspect:
	docker network inspect arch-api_arch-api

network-inspect-prod:
	docker network inspect arch-api_arch-api-prod

arch-db:
	docker compose -f local.yml exec postgres psql --username=kinc --dbname=arch_api

arch-db-prod:
	docker compose -f docker-compose.production.yml exec postgres psql --username=kinc --dbname=arch_api

db-backup:
	docker compose -f local.yml exec postgres backup

db-backup-prod:
	docker compose -f docker-compose.production.yml exec postgres backup

show-db-backups:
	docker compose -f local.yml exec postgres backups

show-db-backups-prod:
	docker compose -f docker-compose.production.yml exec postgres backups

db-restore:
	docker compose -f local.yml exec postgres restore $(backupfile)

db-restore-prod:
	docker compose -f docker-compose.production.yml exec postgres restore $(backupfile)

flake8:
	docker compose -f local.yml exec api flake8 .

flake8-prod:
	docker compose -f docker-compose.production.yml exec api flake8 .

black-check:
	docker compose -f local.yml exec api black --check --exclude=migrations .

black-check-prod:
	docker compose -f docker-compose.production.yml exec api black --check --exclude=migrations .

black-diff:
	docker compose -f local.yml exec api black --diff --exclude=migrations .

black-diff-prod:
	docker compose -f docker-compose.production.yml exec api black --diff --exclude=migrations .

black:
	docker compose -f local.yml exec api black --exclude=migrations .

black-prod:
	docker compose -f docker-compose.production.yml exec api black --exclude=migrations .

isort-check:
	docker compose -f local.yml exec api isort . --check-only --skip .venv --skip migrations

isort-check-prod:
	docker compose -f docker-compose.production.yml exec api isort . --check-only --skip .venv --skip migrations

isort-diff:
	docker compose -f local.yml exec api isort . --diff --skip .venv --skip migrations

isort-diff-prod:
	docker compose -f docker-compose.production.yml exec api isort . --diff --skip .venv --skip migrations

isort:
	docker compose -f local.yml exec api isort . --skip .venv --skip migrations

isort-prod:
	docker compose -f docker-compose.production.yml exec api isort . --skip .venv --skip migrations
