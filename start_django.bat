@echo off
cd /d "I:\coding\ACK\arch-api"
call .venv\Scripts\activate
start /min "" python manage.py runserver 0.0.0.0:8000 >> django_startup_log.txt 2>&1
exit
