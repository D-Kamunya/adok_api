@echo off
cd /d "I:\coding\ACK\arch-api"
:: Ensure logs directory exists
if not exist logs (
    mkdir logs
)
call .venv\Scripts\activate
python manage.py runserver 0.0.0.0:8000 >> logs/django_startup_log.txt 2>&1

